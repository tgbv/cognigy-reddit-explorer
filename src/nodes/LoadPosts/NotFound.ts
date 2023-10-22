import { INodeFunctionBaseParams } from "@cognigy/extension-tools";
import { createNodeDescriptor, setNextNode } from "cognigy-hammer";

// do not modify
const descriptor = createNodeDescriptor(__filename);

descriptor.summary = 'NotFound';
descriptor.defaultLabel = 'NotFound';

descriptor.constraints = {
  placement: {},
  collapsable: true,
  creatable: false,
  deletable: true,
  editable: true,
  movable: true,
};

descriptor.appearance = {
  color: "purple",
  textColor: "white",
  variant: "mini"
}

descriptor.fields = [
  // node fields
];

descriptor.function = async (funcParams: INodeFunctionBaseParams) => {
  const { childConfigs, cognigy, config, nodeId } = funcParams;

  // setNextNode( funcParams, ... );
};

export default descriptor;
