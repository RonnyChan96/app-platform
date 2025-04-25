/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 2025 Huawei Technologies Co., Ltd. All rights reserved.
 *  This file is a part of the ModelEngine Project.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*************************************************请勿修改或删除该文件**************************************************/
import React, { useState, useEffect } from 'react';
import { getQueryParams } from './utils/index';
import { DataContext } from './context';
import SmartForm from "./components/form";

export default function App() {

  const [receiveData, setReceiveData] = useState<any>({});
  const uniqueId = getQueryParams(window.location.href);

  // 终止会话
  const terminateClick = (params: any) => {
    window.parent.postMessage({ type: 'app-engine-form-terminate',...params, uniqueId }, receiveData.origin);
  }

  // 继续会话
  const resumingClick = (params: any) => {
    window.parent.postMessage({ type: 'app-engine-form-resuming', ...params, uniqueId }, receiveData.origin);
  }

  // 重新生成
  const restartClick = (params: any) => {
    window.parent.postMessage({ type: 'app-engine-form-restart', ...params, uniqueId }, receiveData.origin);
  }

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const height = entry.contentRect.height;
        window.parent.postMessage({  type: 'app-engine-form-resize', height, uniqueId }, "*");
      });
    });
    ro.observe(document.querySelector('#custom-smart-form'));
    return () => {
      ro.unobserve(document.querySelector('#custom-smart-form'));
      ro.disconnect();
    };
  }, []);

  return (
    <div className='layout' id="custom-smart-form">
      <DataContext.Provider value={{ data:{data:{"a":"1", "a-options":["1","2"], "a-img":"https://www.gnmxjj.com/uploadfile/202306/85c29e3954fc242.jpg", "a-img-options":["https://www.gnmxjj.com/uploadfile/202306/85c29e3954fc242.jpg","https://www.gnmxjj.com/uploadfile/202306/f47df3e23172196.jpg"], "b": "b","c":"1", "c-options":["1","2"],"d":"1", "d-options":["1","2"], "e":"https://upload.wikimedia.org/wikipedia/commons/5/5f/Liu_Yifei_at_the_2016_BAZAAR_Stars%E2%80%99_Charity_Night.jpg", "f":"qwer"}, schema:{
            "parameters": [
              {
                "id": "input_69509e2b-fa10-4f85-9e23-f013c50c7905",
                "name": "a",
                "displayName": "radio",
                "type": "String",
                "from": "Input",
                "value": "1",
                "renderType": "Radio",
                "options": {
                  "id": "971306a8-7a24-4d3b-8b9a-2a9dfc77ea92",
                  "from": "Input",
                  "referenceNode": null,
                  "referenceId": null,
                  "referenceKey": null,
                  "value": [
                    "1",
                    "2"
                  ],
                  "type": "Array"
                }
              },
              {
                "id": "input_69509e2b-fa10-4f85-9e23-f013c50c7905",
                "name": "a-img",
                "displayName": "radio",
                "type": "String",
                "from": "Input",
                "value": "https://www.gnmxjj.com/uploadfile/202306/85c29e3954fc242.jpg",
                "renderType": "Radio",
                "options": {
                  "id": "971306a8-7a24-4d3b-8b9a-2a9dfc77ea92",
                  "from": "Input",
                  "referenceNode": null,
                  "referenceId": null,
                  "referenceKey": null,
                  "value": [
                    "https://www.gnmxjj.com/uploadfile/202306/85c29e3954fc242.jpg",
                    "https://www.gnmxjj.com/uploadfile/202306/f47df3e23172196.jpg"
                  ],
                  "type": "Array"
                }
              },
              {
                "id": "input_a459dd59-f59c-4d4d-a198-03be576391c6",
                "name": "b",
                "displayName": "input",
                "type": "String",
                "from": "Input",
                "value": "b",
                "renderType": "Input",
                "options": {
                  "id": "e2615231-2420-4d8b-b389-d3f305557f21",
                  "from": "Reference",
                  "referenceNode": "",
                  "referenceId": "",
                  "referenceKey": "",
                  "value": [],
                  "type": "Array"
                }
              },
              {
                "id": "input_69509e2b-fa10-4f85-9e23-f013c50c7905",
                "name": "c",
                "displayName": "checkBox",
                "type": "String",
                "from": "Input",
                "value": "1",
                "renderType": "CheckBox",
                "options": {
                  "id": "971306a8-7a24-4d3b-8b9a-2a9dfc77ea92",
                  "from": "Input",
                  "referenceNode": null,
                  "referenceId": null,
                  "referenceKey": null,
                  "value": [
                    "1",
                    "2"
                  ],
                  "type": "Array"
                }
              },
              {
                "id": "input_69509e2b-fa10-4f85-9e23-f013c50c7905",
                "name": "c-img",
                "displayName": "checkBox",
                "type": "String",
                "from": "Input",
                "value": "1",
                "renderType": "CheckBox",
                "options": {
                  "id": "971306a8-7a24-4d3b-8b9a-2a9dfc77ea92",
                  "from": "Input",
                  "referenceNode": null,
                  "referenceId": null,
                  "referenceKey": null,
                  "value": [
                    "1",
                    "2"
                  ],
                  "type": "Array"
                }
              },
              {
                "id": "input_69509e2b-fa10-4f85-9e23-f013c50c7905",
                "name": "d",
                "displayName": "select",
                "type": "String",
                "from": "Input",
                "value": "1",
                "renderType": "Select",
                "options": {
                  "id": "971306a8-7a24-4d3b-8b9a-2a9dfc77ea92",
                  "from": "Input",
                  "referenceNode": null,
                  "referenceId": null,
                  "referenceKey": null,
                  "value": [
                    "1",
                    "2"
                  ],
                  "type": "Array"
                }
              },
              {
                "id": "input_69509e2b-fa10-4f85-9e23-f013c50c7905",
                "name": "d-img",
                "displayName": "checkBox",
                "type": "String",
                "from": "Input",
                "value": "1",
                "renderType": "CheckBox",
                "options": {
                  "id": "971306a8-7a24-4d3b-8b9a-2a9dfc77ea92",
                  "from": "Input",
                  "referenceNode": null,
                  "referenceId": null,
                  "referenceKey": null,
                  "value": [
                    "1",
                    "2"
                  ],
                  "type": "Array"
                }
              },
              {
                "id": "input_69509e2b-fa10-4f85-9e23-f013c50c7905",
                "name": "e",
                "displayName": "image",
                "type": "String",
                "from": "Input",
                "value": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Liu_Yifei_at_the_2016_BAZAAR_Stars%E2%80%99_Charity_Night.jpg",
                "renderType": "Label",
                "options": {
                  "id": "971306a8-7a24-4d3b-8b9a-2a9dfc77ea92",
                  "from": "Input",
                  "referenceNode": null,
                  "referenceId": null,
                  "referenceKey": null,
                  "value": [],
                  "type": "Array"
                }
              },
              {
                "id": "input_69509e2b-fa10-4f85-9e23-f013c50c7905",
                "name": "f",
                "displayName": "label",
                "type": "String",
                "from": "Input",
                "value": "1",
                "renderType": "Label",
                "options": {
                  "id": "971306a8-7a24-4d3b-8b9a-2a9dfc77ea92",
                  "from": "Input",
                  "referenceNode": null,
                  "referenceId": null,
                  "referenceKey": null,
                  "value": [
                    "1",
                    "2"
                  ],
                  "type": "Array"
                }
              }
            ]}}, origin: window.location.origin, terminateClick, resumingClick, restartClick}}>
        <SmartForm
            onSubmit={data => {
              console.log("data: ", JSON.stringify({"params" : data}));
              resumingClick({"params" : data});
            }}
            onCancel={terminateClick}
        />
      </DataContext.Provider>
    </div>
  )
};
