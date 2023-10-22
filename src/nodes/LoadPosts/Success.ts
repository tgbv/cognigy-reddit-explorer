import { INodeFunctionBaseParams } from "@cognigy/extension-tools";
import { createNodeDescriptor, setNextNode } from "cognigy-hammer";
import { IPost } from "../shared";
import { DateTime } from "luxon";

// do not modify
const descriptor = createNodeDescriptor(__filename);

descriptor.summary = 'Success';
descriptor.defaultLabel = 'Success';

descriptor.constraints = {
  placement: {},
  collapsable: true,
  creatable: false,
  deletable: true,
  editable: true,
  movable: true,
};

descriptor.appearance = {
  color: "#61d188",
  textColor: "white",
  variant: "mini"
}

descriptor.fields = [
  // node fields
  {
    key: "storeInContext",
    label: "Store in Context?",
    type: "toggle",
    defaultValue: false
  },
  {
    key: "contextPath",
    label: "Context path to store the posts in",
    type: "text",
    defaultValue: "posts",
    condition: {
      key: "storeInContext",
      value: true
    }
  }
];

export interface IFuncParams extends INodeFunctionBaseParams {
  config: {
    storeInContext: boolean,
    contextPath: string,
  }
}

descriptor.function = async (funcParams: IFuncParams ) => {
  const { childConfigs, cognigy, config, nodeId } = funcParams;
  const { input, api, context } = cognigy;
  const { contextPath, storeInContext } = config;

  if(storeInContext) {
    api.addToContext?.(contextPath, input.posts, 'simple');
  }

  (input.posts as IPost[]).forEach(({ id, title, author, url, thumbnail, selftext, created_utc  }) => {
    api.say?.('', {
      _cognigy: {
        "_webchat": {
          "type": "adaptiveCard",
          "adaptiveCard": {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.6",
            "body": [
              {
                "type": "TextBlock",
                "text": title,
                "wrap": true,
                "size": "Medium"
              },
              {
                "type": "TextBlock",
                "text": `${author} ${DateTime.fromSeconds(created_utc).setLocale('en-us').toRelative()}`,
                "wrap": true,
                "size": "Small",
                "horizontalAlignment": "Left"
              },
              {
                "type": "TextBlock",
                "text": selftext,
                "wrap": true
              },
              {
                "type": "Image",
                "url": thumbnail
              },
              {
                "type": "ActionSet",
                "actions": [
                  {
                    "type": "Action.Submit",
                    "title": "Load Comments",
                    "role": "Button",
                    "data": { id }
                  },
                ].concat(url && !url.includes(id) ? [{
                  type: 'Action.OpenUrl',
                  title: 'Open URL',
                  // @ts-ignore
                  url
                }] : [])
              }
            ]
          }
        }
      }
    });
  });

  // setNextNode( funcParams, ... );
};

export default descriptor;
