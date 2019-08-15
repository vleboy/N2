import { otherRouter, routers } from '@/router/router'
import Util from '@/libs/util';
export const home = {
    state: {
        pageOpenedList: [],
        openedSubmenuArr: [], // 要展开的菜单数组
        currentPageName: '',
        cachePage: [],
        tagsList: [...otherRouter.children],
        dontCache: [], // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
        menuSize: '180px'
    },
    mutations: {
        //openName
        changeWidth(state, params) {
            state.menuSize = params
        },
        addOpenSubmenu(state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        clearOpenedSubmenu(state) {
            state.openedSubmenuArr.length = 0;
        },
        setTagsList(state, list) {
            state.tagsList.push(...list);
        },
        setCurrentPageName(state, name) {
            state.currentPageName = name;
        },
        clearAllTag(state) {
            state.pageOpenedList.splice(0)
        },
        removeTag(state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        pageOpenedList(state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
        },
        setOpenedList(state, params) {
            routers.map(item => {
                if (item.children && item.children.name == params.currentPageName) {
                    state.pageOpenedList = [item]
                }
            })
        },
        increateTag(state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
            }
            if (state.pageOpenedList.length == 9) {
                state.pageOpenedList.splice(0, 1);
            }
            state.pageOpenedList.push(tagObj);
        },
        closePage(state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
    },
    actions: {
        getGameSign({ commit }, params) {
            return gameSign(params)
        }
    }
}