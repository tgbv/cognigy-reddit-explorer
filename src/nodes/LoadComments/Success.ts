import { INodeFunctionBaseParams } from "@cognigy/extension-tools";
import { createNodeDescriptor } from "cognigy-hammer";
import { IComment } from "../shared";
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
  color: "green",
  textColor: "white",
  variant: "mini"
}

descriptor.function = async (funcParams: INodeFunctionBaseParams) => {
  const { childConfigs, cognigy, config, nodeId } = funcParams;
  const { input, api } = cognigy;

  (input.comments as IComment[]).forEach(({ id, author, thumbnail, body, created_utc }) => {
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
                "text": body,
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
                "type": "Image",
                "url": thumbnail
              }
            ]
          }
        }
      }
    });
  });
};

export default descriptor;
