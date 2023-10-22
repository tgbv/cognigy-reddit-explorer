import { INodeFunctionBaseParams } from "@cognigy/extension-tools";
import axios from "axios";
import { createNodeDescriptor, setNextNode } from "cognigy-hammer";
import { BASE_URL, IComment } from "./shared";
import Success from "./LoadComments/Success";
import ErrorNode from "./LoadComments/Error";

// do not modify
const descriptor = createNodeDescriptor(__filename);

descriptor.summary = 'Load comments of a post in subreddit';
descriptor.defaultLabel = 'Load Comments';

descriptor.constraints = {
  placement: {},
  collapsable: true,
  creatable: true,
  deletable: true,
  editable: true,
  movable: true,
};

descriptor.appearance = {
  color: "white",
  textColor: "black",
  variant: "regular"
}

descriptor.fields = [
  {
    key: "subreddit",
    label: "Subreddit",
    type: "text",
    defaultValue: "worldnews",
    params: {
      required: true
    }
  },
  {
    key: "postId",
    label: "Post ID",
    type: "text",
    params: {
      required: true
    }
  },

  {
    key: "filterState",
    label: "Filter State",
    type: "select",
    defaultValue: "best",
    params: {
      options: [
        {
          label: "Best",
          value: 'best'
        },
        {
          label: "Top",
          value: 'top'
        },
        {
          label: "New",
          value: 'new'
        },
        {
          label: "Controversial",
          value: 'controversial'
        },
        {
          label: "Q&A",
          value: 'qa'
        },
      ]
    }
  },

  {
    key: "limit",
    label: "Limit",
    description: "Limit nr of results",
    type: "number",
    defaultValue: 10,
    params: {
      min: 3,
      max: 100
    }
  },
];

export interface IFuncParams extends INodeFunctionBaseParams {
  config: {
    subreddit: string,
    postId: string,
    filterState: 'best' | 'top' | 'new' | 'controversial' | 'qa',
    limit: number
  }
}

descriptor.function = async (funcParams: IFuncParams) => {
  const { childConfigs, cognigy, config, nodeId } = funcParams;
  const { input, api } = cognigy;
  const { subreddit, filterState, postId, limit } = config;

  try {
    const { data } = await axios({
      method: 'get',
      url: `${BASE_URL}/${subreddit}/comments/${postId}.json?sort=${filterState}&limit=${limit}`,
      maxRedirects: 0
    });

    const comments: IComment[] = data[1].data.children
      .filter(({ kind, data }) => (kind === 't1' && !data.stickied))
      .map(({data}) => {
        const { id, author, thumbnail, body, stickied, created_utc } = data;
        return { id, author, thumbnail, body, stickied, created_utc };
      });

    input.comments = comments

    setNextNode(funcParams, Success);
  } catch (e) {
    input.error = e;
    setNextNode(funcParams, ErrorNode)
  }
  
  // setNextNode( funcParams, ... );
};

export default descriptor;
