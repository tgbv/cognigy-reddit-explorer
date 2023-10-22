import LoadPosts, { IFuncParams } from "./LoadPosts";
import SuccessNode from "./LoadPosts/Success";
import NotFoundNode from "./LoadPosts/NotFound";
import * as cognigyHammer from "cognigy-hammer";

const spySetNextNode = jest.spyOn(cognigyHammer, 'setNextNode');

afterEach(() => {
    spySetNextNode.mockReset();
})

it('it must load reddit posts from subreddit', async () => {
    const input: any = {};
    const nrOfPosts = 2;
    const funcParams = {
        childConfigs: [], 
        config: {
            subreddit: 'worldnews',
            filterState: 'hot',
            limit: nrOfPosts
        }, 
        nodeId: 'mock',
        cognigy: {
            api: { log: jest.fn(), setNextNode: jest.fn() },
            input,
            context: {},
            profile: {}
        }
    } as IFuncParams;

    try {
        await LoadPosts.function?.(funcParams);
    } catch(e) {
        expect(e.message).toContain('targetNodeConfig not found');
    }

    expect(input.posts).toHaveLength(nrOfPosts);
    expect(spySetNextNode).toHaveBeenCalledWith(funcParams, SuccessNode);
});


it('must go to NotFound node when invalid subreddit is given', async () => {
    const funcParams = {
        childConfigs: [], 
        config: {
            subreddit: 'worldnewsdfsds',
            filterState: 'hot',
            limit: 10
        }, 
        nodeId: 'mock',
        cognigy: {
            api: { log: jest.fn(), setNextNode: jest.fn() },
            input: {},
            context: {},
            profile: {}
        }
    } as IFuncParams;

    try {
        await LoadPosts.function?.(funcParams);
    } catch(e) {
        expect(e.message).toContain('targetNodeConfig not found');
    }

    expect(spySetNextNode).toHaveBeenCalledWith(funcParams, NotFoundNode);
});
