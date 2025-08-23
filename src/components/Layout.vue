<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import { fasEarthAmericas, fasFlask } from '@quasar/extras/fontawesome-v6'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { mdiBookPlus, mdiBookOpenVariant, mdiPencil, mdiBookAccount, mdiAccountGroup, mdiFormatLetterCase, mdiPaperclip } from '@quasar/extras/mdi-v5'
import squirrel from '@/assets/img/squirrel.png'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const router = useRouter()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)
const search = ref('')
const showAdvanced = ref(false)
const showDateOptions = ref(false)
const exactPhrase = ref('')
const hasWords = ref('')
const excludeWords = ref('')
const byWebsite = ref('')
const byDate = ref('Any time')

const menuList = computed(() => [
    { icon: 'spa', text: t('menu.analysis'), url: '/study/topic'},
    { icon: 'quiz', text: t('menu.quiz'), url: '/exam/writing' },
    { icon: mdiPencil, text: t('menu.writeDiary'), url: '/diary/write' },
    { icon: mdiBookAccount, text: t('menu.viewDiary'), url: '/diary/official-category/list' },
    { icon: mdiBookPlus, text: t('menu.addWords'), url: '/word' },
    { icon: mdiBookOpenVariant, text: t('menu.vocabulary'), url: '/word/list/mine' },
    { icon: mdiFormatLetterCase, text: t('menu.practiceExpressions'), url: '/expression' },
    { icon: mdiPaperclip, text: t('menu.viewExpressions'), url: '/expression/list' },
]) 

const settingList = [
    // { icon: '', text: 'Language & region' },
    { icon: '', text: 'Settings' },
]

function onClear() {
    exactPhrase.value = ''
    hasWords.value = ''
    excludeWords.value = ''
    byWebsite.value = ''
    byDate.value = 'Any time'
}

function changeDate(option) {
    byDate.value = option
    showDateOptions.value = false
}

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}

function toPage(url) {
    router.push(url)
}

function login() {
    router.push('/login')
}

function logout() {
    authStore.logout()
    router.push('/')
}

function toMyPage() {
    router.push('/user/manage/category')
}

const changeLocale = (lang) => {
    locale.value = lang
    localStorage.setItem('dbgdLocale', lang)
}
</script>

<template>
    <q-layout view="hHh lpR fFf" class="bg-grey-1">
        <q-header elevated class="bg-white text-grey-8" height-hint="64">
            <q-toolbar class="GNL__toolbar">
                <q-btn flat dense round @click="toggleLeftDrawer" aria-label="Menu" icon="menu" class="q-mr-sm" />

                <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
                    <img :src="squirrel" width="70px">
                    <span class="q-ml-sm">{{ $t('common.dobbyGarden') }}</span>
                </q-toolbar-title>

                <q-space />

                <!-- <q-input class="GNL__toolbar-input" outlined dense v-model="search" color="bg-grey-7 shadow-1"
                    placeholder="Search for topics, locations & sources">
                    <template v-slot:prepend>
                        <q-icon v-if="search === ''" name="search" />
                        <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
                    </template>
<template v-slot:append>
                        <q-btn flat dense round aria-label="Menu" icon="arrow_drop_down">
                            <q-menu anchor="bottom end" self="top end">
                                <div class="q-pa-md" style="width: 400px">
                                    <div class="text-body2 text-grey q-mb-md">
                                        Narrow your search results
                                    </div>

                                    <div class="row items-center">
                                        <div class="col-3 text-subtitle2 text-grey">
                                            Exact phrase
                                        </div>
                                        <div class="col-9 q-pl-md">
                                            <q-input dense v-model="exactPhrase" />
                                        </div>

                                        <div class="col-3 text-subtitle2 text-grey">
                                            Has words
                                        </div>
                                        <div class="col-9 q-pl-md">
                                            <q-input dense v-model="hasWords" />
                                        </div>

                                        <div class="col-3 text-subtitle2 text-grey">
                                            Exclude words
                                        </div>
                                        <div class="col-9 q-pl-md">
                                            <q-input dense v-model="excludeWords" />
                                        </div>

                                        <div class="col-3 text-subtitle2 text-grey">
                                            Website
                                        </div>
                                        <div class="col-9 q-pl-md">
                                            <q-input dense v-model="byWebsite" />
                                        </div>

                                        <div class="col-12 q-pt-lg row justify-end">
                                            <q-btn flat dense no-caps color="grey-7" size="md" style="min-width: 68px;"
                                                label="Search" v-close-popup />
                                            <q-btn flat dense no-caps color="grey-7" size="md" style="min-width: 68px;"
                                                @click="onClear" label="Clear" v-close-popup />
                                        </div>
                                    </div>
                                </div>
                            </q-menu>
                        </q-btn>
                    </template>
</q-input> -->

                <q-space />

                <div class="q-gutter-sm row items-center no-wrap">
                    <!-- <q-btn v-if="$q.screen.gt.sm" round dense flat color="text-grey-7" icon="apps">
                        <q-tooltip>Google Apps</q-tooltip>
                    </q-btn>
                    <q-btn round dense flat color="grey-8" icon="notifications">
                        <q-badge color="red" text-color="white" floating>
                            2
                        </q-badge>
                        <q-tooltip>Notifications</q-tooltip>
                    </q-btn> -->
                    <!-- <q-btn round flat>
                        <q-avatar size="26px">
                            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                        </q-avatar>
                        <q-tooltip>Account</q-tooltip>
                    </q-btn> -->
                    <template v-if="authStore.isLoggedIn">
                        <q-btn @click="toMyPage">{{ $t('user.profile') }}</q-btn>
                        <q-btn @click="logout">{{ $t('user.logout')}}</q-btn>
                    </template>
                    <template v-else>
                        <q-btn @click="login">{{ $t('user.login') }}</q-btn>
                    </template>
                    <q-btn-dropdown color="secondary" :label="$t('common.language')">
                        <q-list>
                            <q-item clickable @click="changeLocale('ko')">
                                <q-item-section>한국어</q-item-section>
                            </q-item>
                            <q-item clickable @click="changeLocale('en')">
                                <q-item-section>English</q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                </div>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-white" :width="200">
            <q-scroll-area class="fit">
                <q-list padding class="text-grey-8">
                    <q-item class="GNL__drawer-item" v-ripple v-for="link in menuList" :key="link.text"
                        @click="toPage(link.url)" clickable>
                        <q-item-section avatar>
                            <q-icon :name="link.icon" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>{{ link.text }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-separator inset class="q-my-sm" />

                    <q-item class="GNL__drawer-item" v-ripple v-for="link in settingList" :key="link.text" clickable>
                        <q-item-section>
                            <q-item-label>{{ link.text }} <q-icon v-if="link.icon" :name="link.icon" /></q-item-label>
                        </q-item-section>
                    </q-item>


                    <div class="q-mt-md">
                        <div class="flex flex-center q-gutter-xs">
                            <a class="GNL__drawer-footer-link" href="javascript:void(0)"
                                aria-label="Privacy">Privacy</a>
                            <span> · </span>
                            <a class="GNL__drawer-footer-link" href="javascript:void(0)" aria-label="Terms">Terms</a>
                            <span> · </span>
                            <a class="GNL__drawer-footer-link" href="javascript:void(0)" aria-label="About">About
                                Dobby's garden</a>
                        </div>
                    </div>
                </q-list>
            </q-scroll-area>
        </q-drawer>

        <!-- MEMO 241026 주 컨텐츠 백그라운드 배경 설정: bg-grey-2 -->
        <q-page-container class="bg-grey-2">
            <router-view />
        </q-page-container>
    </q-layout>
</template>


<style lang="sass">
.GNL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 55%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      .q-icon
        color: #5f6368

    .q-item__label
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #000
</style>