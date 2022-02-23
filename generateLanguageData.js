// meant to be run separately from the app
// to generate languageData.json
import fetch from "node-fetch";
import FormData from "isomorphic-form-data";
import fs from "fs";
import arcgisRestRequest from "@esri/arcgis-rest-request";
import {
  searchGroups,
  getUser,
  searchGroupContent,
  getItemData,
} from "@esri/arcgis-rest-portal";

arcgisRestRequest.setDefaultRequestOptions({ fetch, FormData });

const NAME_LOOKUP = {
  "640 _Colored_Pencil": "Colored Pencil",
  "0320_Light_Gray_Canvas_Title": "Gray Canvas",
  "0230_Streets_Night_Title": "Streets (Night)",
  "610_Modern_Antique_Map": "Modern Antique",
  "630_Nova_Map_Vector": "Nova",
  "0400_Ocean_Basemap": "Oceans",
  "510_Community_Map": "Community",
  "550_Human_Geography_Dark_Map": "Human Geography (Dark)",
  "0420_OpenStreetMap": "Open Street Map",
  "530_Newspaper_Map": "Newspaper",
  "0310_Terrain_Labels_Title": "Terrain with Labels",
  "620_Mid_Century_Map": "Mid Century",
  "0210_Topographic_Title": "Topographic",
  "0120_Imagery_Hybrid_Title": "Imagery Hybrid",
  "650_Firefly_Imagery_Hybrid": "Firefly",
  "0401_NatGeo": "National Geographic",
  "520_Navigation_Dark_Mode": "Navigation (Dark)",
  "500_Charted_Territory": "Charted Territory",
  "540_Human_Geography_Map": "Human Geography",
  "0110_Imagery": "Imagery",
  "0330_Dark_Gray_Canvas_Title": "Dark Gray Canvas",
  "0130_Streets_Title": "Streets",
  "0220_Navigation_Title": "Navigation",
};

const getBasemapLayers = async (webmapId) => {
  const itemDataResponse = await getItemData(webmapId);
  return itemDataResponse.baseMap.baseMapLayers;
};

const getMapsForGroup = async (groupId) => {
  const retObj = {};

  const queryResults = await searchGroupContent({
    groupId,
    q: `-type:"Code Attachment" -type:"Featured Items" -type:"Symbol Set" -type:"Color Set" -type:"Windows Viewer Add In" -type:"Windows Viewer Configuration" -type:"Map Area" -typekeywords:"MapAreaPackage" -type:"Indoors Map Configuration" -typekeywords:"SMX"`,
    num: 100,
  });
  // console.log(
  //   "queryResults",
  //   queryResults.results.map((x) => [x.name, x.title, x.thumbnail])
  // );
  // queryResults.results.forEach(async (webmapInfo) => {
  for (let i = 0; i < queryResults.results.length; i++) {
    const webmapInfo = queryResults.results[i];
    // console.log("--- getting layers for ", webmapInfo.name);
    retObj[webmapInfo.name] = await getBasemapLayers(webmapInfo.id);
  }
  return retObj;
};

const getCountryLabelFromUsername = async (username) => {
  // query the user and return the last name
  const userInfo = await getUser(username);
  if (userInfo.lastName == "") {
    if (username === "esri_sk") {
      // manual fix because the user account is not named properly
      // https://gist.github.com/jrnk/8eb57b065ea0b098d571
      userInfo.lastName = "Slovak";
      console.log(
        "Note - Slovak username is not properly named so we manually filled it in."
      );
    } else {
      console.error("error - could not find last name for ", username);
    }
  }
  return userInfo.lastName;
};

const getCountryCodeFromUsername = (username) => {
  const parts = username.split("_");
  if (parts.length > 1) {
    return parts[1].toLowerCase();
  } else {
    console.error("error with", username);
  }
};

const getLanguageInfo = async (groupInfo) => {
  const retObj = {};
  retObj.label = await getCountryLabelFromUsername(groupInfo.owner);
  retObj.group_id = groupInfo.id;
  retObj.group_url = `https://www.arcgis.com/home/group.html?id=${groupInfo.id}`;
  retObj.maps = await getMapsForGroup(groupInfo.id);
  return retObj;
};

const main = async () => {
  const groupsQueryResult = await searchGroups({
    q: `"ArcGIS Online Vector Basemaps"`,
    num: 100, // for debugging, change this to a small number. production set to "100"
  });
  if (groupsQueryResult.nextStart !== -1) {
    console.warn("WARNING - not getting all possible languages!!!!");
  }

  console.log("getting languages ....");
  const languages = {};
  for (let i = 0; i < groupsQueryResult.results.length; i++) {
    const groupInfo = groupsQueryResult.results[i];
    const languageCode = getCountryCodeFromUsername(groupInfo.owner);
    console.log(
      `Working on ${languageCode}, ${(
        (i / groupsQueryResult.results.length) *
        100
      ).toFixed(1)}%`
    );
    // const languageLabel = await getCountryLabelFromUsername(groupInfo.owner);
    languages[languageCode] = Object.assign(
      {},
      { id: languageCode },
      await getLanguageInfo(groupInfo)
    );
  }
  // console.log("languages:", languages);

  console.log("generating styles ....");
  const styles = {};
  Object.values(languages).forEach((language) => {
    Object.keys(language.maps).forEach((styleName) => {
      if (NAME_LOOKUP.hasOwnProperty(styleName)) {
        const label = NAME_LOOKUP[styleName];
        styles[styleName] = { id: styleName, label };
      } else {
        console.log("could not find in NAME_LOOkUP:", styleName);
      }
    });
  });
  // console.log('styles', styles);

  const objectToWrite = {
    styles,
    languages,
  };
  fs.writeFileSync("languageData.json", JSON.stringify(objectToWrite, null, 2));
  fs.writeFileSync("languageData.min.json", JSON.stringify(objectToWrite));
};

main();
