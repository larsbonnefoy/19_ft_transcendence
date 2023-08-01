<template>
    <nav :class="[`navbar-${theme}`, `bg-${theme}`, 'navbar', 'navbar-expand-lg']">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">img</a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li v-for="(page, index) in publishedPages" class="nav-item" :key="index">
                        <HeaderBarLink
                            :page="page"
                            :isActive="activePage == index"
                            @click.prevent="navLinkClick(index)"
                        ></HeaderBarLink>
                    </li>
                </ul>
            </div>
        
            <form class="d-flex">
                <button
                class="btn"
                :class="[`btn-outline-${offTheme}`]"
                @click.prevent="changeTheme()">Toggle
                </button>
            </form>
        </div>
    </nav>

</template>

<script lang="ts">
import HeaderBarLink from './HeaderBarLink.vue';

export default {
    components: {
        HeaderBarLink
    },
    created() {
        this.getThemeSetting();
    },
    computed: {
        publishedPages() {
            console.log(this.pages.filter((p : any) => p.published));
            console.log(this.activePage);
            return this.pages.filter((p : any) => p.published)
        }
    },
    props: ['pages', 'activePage', 'navLinkClick'],
    data() {
        return {
            theme: 'dark',
            offTheme: 'light',
        }
    },
    methods: {
        changeTheme() {
            let theme = 'light';
            let offTheme = 'dark'

            if (this.theme == 'light') {
                theme='dark'
                offTheme = 'light'
            }

            this.theme = theme;
            this.offTheme = offTheme;
            this.storeThemeSetting();
        },
        storeThemeSetting() {
            localStorage.setItem('theme', this.theme);
            localStorage.setItem('offTheme', this.offTheme);
        },
        getThemeSetting() {
                let theme = localStorage.getItem('theme');
                let offTheme = localStorage.getItem('offTheme');

                if (theme && offTheme) {
                    this.theme = theme;
                    this.offTheme = offTheme;
                }
        }
    }
}
</script>
