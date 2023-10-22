import { INodeFunctionBaseParams } from "@cognigy/extension-tools";
import { createNodeDescriptor, setNextNode } from "cognigy-hammer";

// do not modify
const descriptor = createNodeDescriptor(__filename);

descriptor.summary = 'Error';
descriptor.defaultLabel = 'Error';

descriptor.constraints = {
  placement: {},
  collapsable: true,
  creatable: false,
  deletable: true,
  editable: true,
  movable: true,
};

descriptor.appearance = {
  color: "red",
  textColor: "white",
  variant: "mini"
}

descriptor.fields = [];

descriptor.function = async (funcParams: INodeFunctionBaseParams) => {
  const { childConfigs, cognigy, config, nodeId } = funcParams;
  const { input, api } = cognigy;

  api.log?.('error', JSON.stringify(input.error))
};

export default descriptor;
