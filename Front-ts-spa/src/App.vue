<template>
    <!-- Should hide header bar when loggin in -->
    <header-bar
        :pages="pages"
        :active-page="activePage"
        :nav-link-click="(index: number) => activePage = index"> 
    </header-bar>

    <!-- 
    <page-content
        v-if="pages.length > 1"
        :page="pages[activePage]">
    </page-content> -->
    <createPage
        :page-created="pageCreated">
    </createPage>

</template>

<script lang="ts">
import headerBar from './components/HeaderBar.vue';
import pageContent from './components/PageContent.vue';
import createPage from './components/CreatePage.vue';

export default {
    components : {
        headerBar,
        pageContent,
        createPage
    },
    created() {
        this.getPages();
    }, 
    data() {
        return {
            activePage: 0,
            pages: [] as Object[]
        };
    },
    methods: {
        async getPages() {
            let res= await fetch('pages.json');
            let data : any = [];
            data= await res.json();
            
            this.pages = data;
        },
        pageCreated(pageObj: Object) {
            this.pages.push(pageObj);
        }
    }
};
</script>