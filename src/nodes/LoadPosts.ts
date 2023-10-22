import { INodeFunctionBaseParams } from "@cognigy/extension-tools";
import { createNodeDescriptor, setNextNode } from "cognigy-hammer";
import { BASE_URL, IPost } from "./shared";
import axios from "axios";

import NotFound from "./LoadPosts/NotFound";
import ErrorNode from "./LoadPosts/Error";
import Success from "./LoadPosts/Success";

// do not modify
const descriptor = createNodeDescriptor(__filename);

descriptor.summary = 'Load posts from a subreddit.';
descriptor.defaultLabel = 'Load Posts';

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
    key: "filterState",
    label: "Filter State",
    type: "select",
    defaultValue: "hot",
    params: {
      options: [
        {
          label: "Hot",
          value: 'hot'
        },
        {
          label: "New",
          value: 'new'
        },
        {
          label: "Rising",
          value: 'rising'
        },
        {
          label: "Top",
          value: 'top'
        },
      ]
    }
  },

  {
    key: "limit",
    label: "Limit",
    description: "Limit nr of results",
    type: "number",
    defaultValue: 25,
    params: {
      min: 1,
      max: 100
    }
  },
];


export interface IFuncParams extends INodeFunctionBaseParams {
  config: {
    subreddit: string,
    filterState: 'hot' | 'new' | 'rising' | 'top',
    limit: number
  }
}

descriptor.function = async (funcParams: IFuncParams) => {
  const { childConfigs, cognigy, config, nodeId } = funcParams;
  const { input, api } = cognigy;
  const { subreddit, filterState, limit } = config;

  try {
    const { data } = await axios({
      method: 'get',
      url: `${BASE_URL}/${subreddit}/${filterState}.json?limit=${limit}`,
      maxRedirects: 0
    });

    const posts: IPost[] = data.data.children.map((post) => {
      const { id, title, author, url, thumbnail, selftext, stickied, created_utc } = post.data;
      return { id, title, author, url, thumbnail, selftext, stickied, created_utc };
    });

    input.posts = posts.filter(({ stickied }) => !stickied);

    setNextNode(funcParams, Success);
  } catch (e) {
    if (e.response?.status === 404 || e.response?.status === 302) {
      setNextNode(funcParams, NotFound);
    } else {
      input.error = e;
      setNextNode(funcParams, ErrorNode)
    }
  }
};

export default descriptor;
