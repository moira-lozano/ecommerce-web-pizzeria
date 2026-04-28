<template>
    <div :class="[themeClasses.body, fontSize === 'large' ? 'text-lg' : '']" class="min-h-screen transition-all duration-300" :data-font-size="fontSize" :data-theme="currentTheme">
        <!-- Mobile Menu Button -->
        <button
            @click="sidebarOpen = !sidebarOpen"
            class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg shadow-lg"
        >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>

        <!-- Mobile Overlay -->
        <Transition
            enter-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="sidebarOpen"
                @click="sidebarOpen = false"
                class="lg:hidden fixed inset-0 bg-black/50 z-40"
            ></div>
        </Transition>

        <div class="flex h-screen overflow-hidden">
            <!-- Sidebar -->
            <aside
                :class="[
                    `fixed lg:static inset-y-0 left-0 z-40 w-64 ${themeClasses.sidebar} text-white shadow-2xl flex flex-col transform transition-all duration-300 ease-in-out`,
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                ]"
            >
                <!-- Logo -->
                <div class="p-4 lg:p-6 border-b border-slate-700 dark:border-slate-600 flex items-center justify-between">
                    <Link :href="route('admin.dashboard')" @click="sidebarOpen = false" class="flex-1">
                        <h1 class="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
                            🏢 Pizzeria
                        </h1>
                        <p class="text-xs lg:text-sm text-slate-400 dark:text-slate-300 mt-1 hidden lg:block">Panel Administrativo</p>
                    </Link>
                    <button
                        @click="sidebarOpen = false"
                        class="lg:hidden p-2 hover:bg-slate-700 dark:hover:bg-slate-600 rounded-lg"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Navegación -->
                <nav class="flex-1 p-2 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
                    <Link
                        v-for="(item, index) in menuItems"
                        :key="item.href"
                        :href="item.href"
                        @click="sidebarOpen = false"
                        :class="[
                            'flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-200 group text-sm lg:text-base',
                            $page.url.startsWith(item.href)
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-lg'
                                : 'text-slate-300 dark:text-slate-400 hover:bg-slate-700 dark:hover:bg-slate-600 hover:text-white'
                        ]"
                    >
                        <span class="text-lg lg:text-xl">{{ item.icon }}</span>
                        <span class="font-medium truncate">{{ item.label }}</span>
                        <span v-if="item.badge" class="ml-auto bg-red-500 text-xs px-2 py-1 rounded-full flex-shrink-0">
                            {{ item.badge }}
                        </span>
                    </Link>
                </nav>

                <!-- User Info -->
                <div class="p-3 lg:p-4 border-t border-slate-700 dark:border-slate-600">
                    <div class="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                        <div class="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs lg:text-sm flex-shrink-0">
                            {{ userInitials }}
                        </div>
                        <div class="flex-1 min-w-0 hidden lg:block">
                            <p class="text-sm font-medium text-white truncate">{{ $page.props.auth?.user?.nombre }}</p>
                            <p class="text-xs text-slate-400 truncate">{{ $page.props.auth?.user?.rol?.nombre }}</p>
                        </div>
                    </div>
                    <div class="space-y-1">
                        <!-- <Link
                            href="/profile"
                            @click="sidebarOpen = false"
                            class="flex items-center gap-2 px-3 py-2 text-xs lg:text-sm text-slate-300 dark:text-slate-400 hover:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors"
                        >
                            <span>👤</span>
                            <span class="hidden lg:inline">Mi Perfil</span>
                        </Link> -->
                        <Link
                            :href="route('shop.index')"
                            @click="sidebarOpen = false"
                            class="flex items-center gap-2 px-3 py-2 text-xs lg:text-sm text-slate-300 dark:text-slate-400 hover:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors"
                        >
                            <span>🛒</span>
                            <span class="hidden lg:inline">Ver Tienda</span>
                        </Link>
                        <Link
                            :href="route('logout')"
                            method="post"
                            as="button"
                            @click="sidebarOpen = false"
                            class="flex items-center gap-2 w-full text-left px-3 py-2 text-xs lg:text-sm text-red-400 dark:text-red-300 hover:bg-red-900/20 dark:hover:bg-red-800/30 rounded-lg transition-colors"
                        >
                            <span>🚪</span>
                            <span class="hidden lg:inline">Cerrar Sesión</span>
                        </Link>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 overflow-y-auto lg:ml-0 bg-white dark:bg-gray-900 transition-colors duration-300">
                <!-- Top Bar -->
                <header :class="`${themeClasses.header} backdrop-blur-sm border-b sticky top-0 z-30 shadow-sm transition-colors duration-300`">
                    <div class="px-3 sm:px-4 lg:px-6 py-2.5 lg:py-3">
                        <!-- Mobile Layout -->
                        <div class="lg:hidden space-y-2">
                            <div class="flex items-center justify-between gap-2">
                                <div class="flex-1 min-w-0">
                                <h2 :class="`text-lg font-bold bg-gradient-to-r ${themeClasses.titleGradient} bg-clip-text text-transparent truncate ${themeClasses.contrast.text}`">
                                    <slot name="title">{{ pageTitle }}</slot>
                                </h2>
                                </div>
                                <div class="flex items-center gap-2">
                                    <!-- Mobile Theme, Contrast & Dark Mode Buttons -->
                                    <div class="flex items-center gap-1.5">
                                        <div class="relative" data-dark-mode-menu>
                                            <button
                                                @click.stop="showDarkModeMenu = !showDarkModeMenu"
                                                class="p-2 rounded-lg border transition-all duration-200"
                                                :class="[themeClasses.input, themeClasses.contrast.border]"
                                                title="Modo Día/Noche"
                                            >
                                                <span class="text-base">{{ darkMode ? '🌙' : '☀️' }}</span>
                                            </button>
                                        </div>
                                        <div class="relative" data-contrast-menu>
                                            <button
                                                @click.stop="showContrastMenu = !showContrastMenu"
                                                class="p-2 rounded-lg border transition-all duration-200"
                                                :class="[themeClasses.input, themeClasses.contrast.border]"
                                                title="Contraste"
                                            >
                                                <span class="text-base">{{ currentContrastData.icon }}</span>
                                            </button>
                                        </div>
                                        <div class="relative" data-theme-menu>
                                            <button
                                                @click.stop="showThemeMenu = !showThemeMenu"
                                                class="p-2 rounded-lg border transition-all duration-200"
                                                :class="[themeClasses.input, themeClasses.contrast.border]"
                                                title="Tema"
                                            >
                                                <span class="text-lg">{{ currentThemeData.icon }}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="text-right flex-shrink-0">
                                        <p :class="`text-xs ${themeClasses.textSecondary}`">{{ currentDateShort }}</p>
                                    </div>
                                </div>
                            </div>
                            <!-- Mobile Search -->
                            <div class="relative">
                                    <input
                                        v-model="searchQuery"
                                        @input="handleSearch"
                                        @focus="showSearchResults = true"
                                        @blur="setTimeout(() => showSearchResults = false, 200)"
                                        @keydown="handleKeyDown"
                                        type="text"
                                        placeholder="Buscar... (Ctrl+K)"
                                        :class="[
                                            'w-full pl-9 pr-20 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm shadow-sm transition-colors duration-200',
                                            themeClasses.input,
                                            themeClasses.focusRing,
                                            themeClasses.contrast.border,
                                            themeClasses.contrast.text
                                        ]"
                                    />
                                <div class="absolute left-2.5 top-1/2 transform -translate-y-1/2">
                                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                                    <kbd v-if="!searchQuery" class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                                        ⌘K
                                    </kbd>
                                    <button
                                        v-if="searchQuery"
                                        @click="clearSearch"
                                        class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 transition-colors"
                                    >
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <!-- Mobile Search Results -->
                                <Transition
                                    enter-active-class="transition ease-out duration-200"
                                    enter-from-class="opacity-0 transform scale-95"
                                    enter-to-class="opacity-100 transform scale-100"
                                    leave-active-class="transition ease-in duration-150"
                                    leave-from-class="opacity-100 transform scale-100"
                                    leave-to-class="opacity-0 transform scale-95"
                                >
                                    <div
                                        v-if="showSearchResults"
                                        :class="`absolute z-50 w-full mt-1 ${themeClasses.card} rounded-lg shadow-xl border max-h-80 overflow-y-auto transition-colors duration-200`"
                                    >
                                        <!-- Loading State -->
                                        <div v-if="isSearching" class="p-4 text-center">
                                            <div class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400"></div>
                                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Buscando...</p>
                                        </div>

                                        <!-- Results -->
                                        <template v-else-if="searchResults.length > 0">
                                            <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                                                {{ searchQuery ? 'Resultados' : 'Búsquedas recientes' }}
                                            </div>
                                            <div
                                                v-for="(result, index) in searchResults"
                                                :key="result.href"
                                                @click="navigateTo(result.href)"
                                                :class="[
                                                    'p-2.5 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors',
                                                    selectedResultIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                                ]"
                                            >
                                                <div class="flex items-center gap-2.5">
                                                    <span class="text-lg flex-shrink-0">{{ result.icon }}</span>
                                                    <div class="flex-1 min-w-0">
                                                        <p class="font-medium text-gray-900 dark:text-gray-100 text-xs" v-html="result.highlightedLabel || result.label"></p>
                                                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate" v-html="result.highlightedDescription || result.description"></p>
                                                    </div>
                                                    <span v-if="result.isHistory" class="text-xs text-gray-400">🕐</span>
                                                </div>
                                            </div>
                                        </template>

                                        <!-- No Results -->
                                        <div v-else-if="searchQuery && !isSearching" class="p-4 text-center">
                                            <p class="text-sm text-gray-500 dark:text-gray-400">No se encontraron resultados</p>
                                            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Intenta con otros términos</p>
                                        </div>

                                        <!-- Empty State -->
                                        <div v-else-if="!searchQuery && searchHistory.length === 0" class="p-4 text-center">
                                            <p class="text-sm text-gray-500 dark:text-gray-400">Comienza a buscar en el sistema</p>
                                            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Usa Ctrl+K para buscar rápidamente</p>
                                        </div>
                                    </div>
                                </Transition>
                            </div>

                            <!-- Mobile Contrast Menu -->
                            <Transition
                                enter-active-class="transition ease-out duration-200"
                                enter-from-class="opacity-0 transform scale-95"
                                enter-to-class="opacity-100 transform scale-100"
                                leave-active-class="transition ease-in duration-150"
                                leave-from-class="opacity-100 transform scale-100"
                                leave-to-class="opacity-0 transform scale-95"
                            >
                                <div
                                    v-if="showContrastMenu"
                                    @click.stop
                                    class="rounded-lg shadow-xl border overflow-hidden"
                                    :class="[themeClasses.card, themeClasses.contrast.border]"
                                >
                                    <div class="p-2 space-y-1">
                                        <div class="px-2 py-1 text-xs font-semibold" :class="themeClasses.textSecondary">
                                            Contraste
                                        </div>
                                        <button
                                            v-for="(contrast, key) in contrastLevels"
                                            :key="key"
                                            @click="selectContrast(key)"
                                            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200"
                                            :class="[
                                                currentContrast === key
                                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            ]"
                                        >
                                            <span class="text-lg">{{ contrast.icon }}</span>
                                            <span class="flex-1 text-left text-xs font-medium">{{ contrast.name }}</span>
                                            <svg v-if="currentContrast === key" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </Transition>

                            <!-- Mobile Dark Mode Menu -->
                            <Transition
                                enter-active-class="transition ease-out duration-200"
                                enter-from-class="opacity-0 transform scale-95"
                                enter-to-class="opacity-100 transform scale-100"
                                leave-active-class="transition ease-in duration-150"
                                leave-from-class="opacity-100 transform scale-100"
                                leave-to-class="opacity-0 transform scale-95"
                            >
                                <div
                                    v-if="showDarkModeMenu"
                                    @click.stop
                                    class="rounded-lg shadow-xl border overflow-hidden"
                                    :class="[themeClasses.card, themeClasses.contrast.border]"
                                >
                                    <div class="p-2 space-y-1">
                                        <div class="px-2 py-1 text-xs font-semibold" :class="themeClasses.textSecondary">
                                            Modo
                                        </div>
                                        <button
                                            @click="selectDarkMode(false)"
                                            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200"
                                            :class="[
                                                !darkMode
                                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            ]"
                                        >
                                            <span class="text-lg">☀️</span>
                                            <span class="flex-1 text-left text-xs font-medium">Día</span>
                                            <svg v-if="!darkMode" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                        <button
                                            @click="selectDarkMode(true)"
                                            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200"
                                            :class="[
                                                darkMode
                                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            ]"
                                        >
                                            <span class="text-lg">🌙</span>
                                            <span class="flex-1 text-left text-xs font-medium">Noche</span>
                                            <svg v-if="darkMode" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </Transition>

                            <!-- Mobile Theme Menu -->
                            <Transition
                                enter-active-class="transition ease-out duration-200"
                                enter-from-class="opacity-0 transform scale-95"
                                enter-to-class="opacity-100 transform scale-100"
                                leave-active-class="transition ease-in duration-150"
                                leave-from-class="opacity-100 transform scale-100"
                                leave-to-class="opacity-0 transform scale-95"
                            >
                                <div
                                    v-if="showThemeMenu"
                                    @click.stop
                                    class="rounded-lg shadow-xl border overflow-hidden"
                                    :class="[themeClasses.card, themeClasses.contrast.border]"
                                >
                                    <div class="p-2 space-y-1">
                                        <div class="px-2 py-1 text-xs font-semibold" :class="themeClasses.textSecondary">
                                            Tema por Edad
                                        </div>
                                        <button
                                            v-for="(theme, key) in themes"
                                            :key="key"
                                            @click="selectTheme(key)"
                                            class="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                                            :class="[
                                                currentTheme === key
                                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            ]"
                                        >
                                            <span class="text-xl mt-0.5">{{ theme.icon }}</span>
                                            <div class="flex-1 text-left min-w-0">
                                                <div class="text-sm font-medium" :class="themeClasses.contrast.text">{{ theme.name }}</div>
                                                <div class="text-xs opacity-75 mt-0.5">{{ theme.description }}</div>
                                            </div>
                                            <svg v-if="currentTheme === key" class="w-4 h-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </Transition>
                        </div>


                        <!-- Desktop Layout -->
                        <div class="hidden lg:flex items-center justify-between gap-4">
                            <!-- Title Section -->
                            <div class="flex-1 min-w-0">
                                <h2 :class="`text-xl xl:text-2xl font-bold bg-gradient-to-r ${themeClasses.titleGradient} bg-clip-text text-transparent truncate ${themeClasses.contrast.text}`">
                                    <slot name="title">{{ pageTitle }}</slot>
                                </h2>
                                <p :class="`text-xs ${themeClasses.textSecondary} mt-0.5 ${themeClasses.contrast.text}`">
                                    <slot name="subtitle">Bienvenido, {{ $page.props.auth?.user?.nombre }}</slot>
                                </p>
                            </div>

                            <!-- Search Bar - Compact -->
                            <div class="flex-shrink-0 w-64 xl:w-80">
                                <div class="relative">
                                    <input
                                        v-model="searchQuery"
                                        @input="handleSearch"
                                        @focus="showSearchResults = true"
                                        @blur="setTimeout(() => showSearchResults = false, 200)"
                                        @keydown="handleKeyDown"
                                        type="text"
                                        placeholder="Buscar en el sistema... (Ctrl+K)"
                                        :class="[
                                            'w-full pl-9 pr-20 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm shadow-sm transition-colors duration-200',
                                            themeClasses.input,
                                            themeClasses.focusRing,
                                            themeClasses.contrast.border,
                                            themeClasses.contrast.text
                                        ]"
                                    />
                                    <div class="absolute left-2.5 top-1/2 transform -translate-y-1/2">
                                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                                        <kbd v-if="!searchQuery" class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                                            ⌘K
                                        </kbd>
                                        <button
                                            v-if="searchQuery"
                                            @click="clearSearch"
                                            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 transition-colors"
                                        >
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <!-- Desktop Search Results -->
                                    <Transition
                                        enter-active-class="transition ease-out duration-200"
                                        enter-from-class="opacity-0 transform scale-95"
                                        enter-to-class="opacity-100 transform scale-100"
                                        leave-active-class="transition ease-in duration-150"
                                        leave-from-class="opacity-100 transform scale-100"
                                        leave-to-class="opacity-0 transform scale-95"
                                    >
                                        <div
                                            v-if="showSearchResults"
                                            :class="`absolute z-50 w-full mt-2 ${themeClasses.card} rounded-lg shadow-xl border max-h-96 overflow-y-auto transition-colors duration-200`"
                                        >
                                            <!-- Loading State -->
                                            <div v-if="isSearching" class="p-4 text-center">
                                                <div class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
                                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Buscando...</p>
                                            </div>

                                            <!-- Results -->
                                            <template v-else-if="searchResults.length > 0">
                                                <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                                                    {{ searchQuery ? 'Resultados' : 'Búsquedas recientes' }}
                                                </div>
                                                <div
                                                    v-for="(result, index) in searchResults"
                                                    :key="result.href"
                                                    @click="navigateTo(result.href)"
                                                    :class="[
                                                        'p-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors',
                                                        selectedResultIndex === index
                                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500'
                                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    ]"
                                                >
                                                    <div class="flex items-center gap-3">
                                                        <span class="text-xl flex-shrink-0">{{ result.icon }}</span>
                                                        <div class="flex-1 min-w-0">
                                                            <p class="font-medium text-gray-900 dark:text-gray-100 text-sm" v-html="result.highlightedLabel || result.label"></p>
                                                            <p class="text-xs text-gray-500 dark:text-gray-400 truncate" v-html="result.highlightedDescription || result.description"></p>
                                                        </div>
                                                        <div class="flex items-center gap-2 flex-shrink-0">
                                                            <span v-if="result.isHistory" class="text-xs text-gray-400">🕐</span>
                                                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 border-t dark:border-gray-700">
                                                    <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↑↓</kbd> Navegar
                                                    <kbd class="ml-2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd> Seleccionar
                                                    <kbd class="ml-2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Esc</kbd> Cerrar
                                                </div>
                                            </template>

                                            <!-- No Results -->
                                            <div v-else-if="searchQuery && !isSearching" class="p-6 text-center">
                                                <svg class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">No se encontraron resultados</p>
                                                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Intenta con otros términos de búsqueda</p>
                                            </div>

                                            <!-- Empty State -->
                                            <div v-else-if="!searchQuery && searchHistory.length === 0" class="p-6 text-center">
                                                <svg class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Comienza a buscar en el sistema</p>
                                                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Usa <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Ctrl+K</kbd> para buscar rápidamente</p>
                                            </div>
                                        </div>
                                    </Transition>
                                </div>
                            </div>

                            <Link 
                                    :href="route('admin.pagos.index')" 
                                    class="relative group p-2.5 rounded-xl border transition-all duration-300 shadow-sm"
                                    :class="[themeClasses.input, themeClasses.contrast.border, 'hover:border-red-500/50']"
                                    title="Pagos por verificar"
                                >
                                    <span class="text-xl group-hover:scale-110 transition-transform inline-block">🔔</span>
                                    
                                    <span 
                                        v-if="$page.props.auth.user?.notificaciones?.pagos_pendientes > 0"
                                        class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white ring-2 ring-white dark:ring-gray-900 animate-pulse shadow-md"
                                    >
                                        {{ $page.props.auth.user.notificaciones.pagos_pendientes > 9 ? '9+' : $page.props.auth.user.notificaciones.pagos_pendientes }}
                                    </span>
                            </Link>

                            <!-- Theme, Contrast & Dark Mode Selectors -->
                            <div class="flex items-center gap-2">
                                <!-- Dark Mode Selector -->
                                <div class="flex-shrink-0 relative" data-dark-mode-menu>
                                    <button
                                        @click.stop="showDarkModeMenu = !showDarkModeMenu"
                                        class="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
                                        :class="[themeClasses.input, themeClasses.contrast.border]"
                                        title="Modo Día/Noche"
                                    >
                                        <span class="text-base">{{ darkMode ? '🌙' : '☀️' }}</span>
                                        <span class="hidden lg:inline text-xs font-medium">{{ darkMode ? 'Noche' : 'Día' }}</span>
                                    </button>

                                    <!-- Dark Mode Menu -->
                                    <Transition
                                        enter-active-class="transition ease-out duration-200"
                                        enter-from-class="opacity-0 transform scale-95"
                                        enter-to-class="opacity-100 transform scale-100"
                                        leave-active-class="transition ease-in duration-150"
                                        leave-from-class="opacity-100 transform scale-100"
                                        leave-to-class="opacity-0 transform scale-95"
                                    >
                                        <div
                                            v-if="showDarkModeMenu"
                                            @click.stop
                                            class="absolute right-0 mt-2 w-40 rounded-lg shadow-xl border z-50 overflow-hidden"
                                            :class="[themeClasses.card, themeClasses.contrast.border]"
                                        >
                                            <div class="p-2 space-y-1">
                                                <div class="px-2 py-1 text-xs font-semibold" :class="themeClasses.textSecondary">
                                                    Modo
                                                </div>
                                                <button
                                                    @click="selectDarkMode(false)"
                                                    class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200"
                                                    :class="[
                                                        !darkMode
                                                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600'
                                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    ]"
                                                >
                                                    <span class="text-lg">☀️</span>
                                                    <span class="flex-1 text-left text-xs font-medium">Día</span>
                                                    <svg v-if="!darkMode" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    @click="selectDarkMode(true)"
                                                    class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200"
                                                    :class="[
                                                        darkMode
                                                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600'
                                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    ]"
                                                >
                                                    <span class="text-lg">🌙</span>
                                                    <span class="flex-1 text-left text-xs font-medium">Noche</span>
                                                    <svg v-if="darkMode" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </Transition>
                                </div>

                                <!-- Contrast Selector -->
                                <div class="flex-shrink-0 relative" data-contrast-menu>
                                    <button
                                        @click.stop="showContrastMenu = !showContrastMenu"
                                        class="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
                                        :class="[themeClasses.input, themeClasses.contrast.border]"
                                        title="Contraste"
                                    >
                                        <span class="text-base">{{ currentContrastData.icon }}</span>
                                        <span class="hidden lg:inline text-xs font-medium">{{ currentContrastData.name }}</span>
                                    </button>

                                    <!-- Contrast Menu -->
                                    <Transition
                                        enter-active-class="transition ease-out duration-200"
                                        enter-from-class="opacity-0 transform scale-95"
                                        enter-to-class="opacity-100 transform scale-100"
                                        leave-active-class="transition ease-in duration-150"
                                        leave-from-class="opacity-100 transform scale-100"
                                        leave-to-class="opacity-0 transform scale-95"
                                    >
                                        <div
                                            v-if="showContrastMenu"
                                            @click.stop
                                            class="absolute right-0 mt-2 w-44 rounded-lg shadow-xl border z-50 overflow-hidden"
                                            :class="[themeClasses.card, themeClasses.contrast.border]"
                                        >
                                            <div class="p-2 space-y-1">
                                                <div class="px-2 py-1 text-xs font-semibold" :class="themeClasses.textSecondary">
                                                    Contraste
                                                </div>
                                                <button
                                                    v-for="(contrast, key) in contrastLevels"
                                                    :key="key"
                                                    @click="selectContrast(key)"
                                                    class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200"
                                                    :class="[
                                                        currentContrast === key
                                                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600'
                                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    ]"
                                                >
                                                    <span class="text-lg">{{ contrast.icon }}</span>
                                                    <span class="flex-1 text-left text-xs font-medium">{{ contrast.name }}</span>
                                                    <svg v-if="currentContrast === key" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </Transition>
                                </div>

                                <!-- Theme Selector -->
                                <div class="flex-shrink-0 relative" data-theme-menu>
                                    <button
                                        @click.stop="showThemeMenu = !showThemeMenu"
                                        class="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
                                        :class="[themeClasses.input, themeClasses.contrast.border]"
                                        title="Tema"
                                    >
                                        <span class="text-lg">{{ currentThemeData.icon }}</span>
                                        <span class="hidden xl:inline text-sm font-medium" :class="themeClasses.contrast.text">{{ currentThemeData.name }}</span>
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <!-- Theme Menu -->
                                    <Transition
                                        enter-active-class="transition ease-out duration-200"
                                        enter-from-class="opacity-0 transform scale-95"
                                        enter-to-class="opacity-100 transform scale-100"
                                        leave-active-class="transition ease-in duration-150"
                                        leave-from-class="opacity-100 transform scale-100"
                                        leave-to-class="opacity-0 transform scale-95"
                                    >
                                        <div
                                            v-if="showThemeMenu"
                                            @click.stop
                                            class="absolute right-0 mt-2 w-56 rounded-lg shadow-xl border z-50 overflow-hidden"
                                            :class="[themeClasses.card, themeClasses.contrast.border]"
                                        >
                                            <div class="p-2 space-y-1">
                                                <div class="px-2 py-1 text-xs font-semibold" :class="themeClasses.textSecondary">
                                                    Tema por Edad
                                                </div>
                                                <button
                                                    v-for="(theme, key) in themes"
                                                    :key="key"
                                                    @click="selectTheme(key)"
                                                    class="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                                                    :class="[
                                                        currentTheme === key
                                                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600'
                                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    ]"
                                                >
                                                    <span class="text-xl mt-0.5">{{ theme.icon }}</span>
                                                    <div class="flex-1 text-left min-w-0">
                                                        <div class="text-sm font-medium" :class="themeClasses.contrast.text">{{ theme.name }}</div>
                                                        <div class="text-xs opacity-75 mt-0.5">{{ theme.description }}</div>
                                                    </div>
                                                    <svg v-if="currentTheme === key" class="w-4 h-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </Transition>
                                </div>
                            </div>

                            <!-- Date Section -->
                            <div class="flex-shrink-0 text-right hidden xl:block">
                                <p :class="`text-xs ${themeClasses.textSecondary}`">Fecha</p>
                                <p :class="`text-sm font-semibold ${themeClasses.text} whitespace-nowrap`">{{ currentDateShort }}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Page Content -->
                <div class="p-3 sm:p-4 lg:p-6 bg-white dark:bg-gray-900 transition-colors duration-300">
                    <slot />
                </div>

                <!-- Footer con Contador -->
                <footer :class="`${themeClasses.footer || 'bg-gray-50 dark:bg-gray-900'} border-t ${themeClasses.border || 'border-gray-200 dark:border-gray-700'} transition-colors duration-300`">
                    <div class="px-3 sm:px-4 lg:px-6 py-3">
                        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div class="flex items-center gap-4 text-sm" :class="themeClasses.textSecondary">
                                <span class="flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span class="font-medium">{{ nombrePaginaActual }}:</span>
                                    <span class="font-bold text-blue-600 dark:text-blue-400" v-motion-pop>{{ contadorPaginaActual }}</span>
                                </span>
                                <span class="flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span class="font-medium">Hoy:</span>
                                    <span class="font-bold text-green-600 dark:text-green-400" v-motion-pop>{{ contadorPaginaActualHoy }}</span>
                                </span>
                            </div>
                            <div class="text-xs" :class="themeClasses.textSecondary">
                                <span>© {{ currentYear }} TecnoWeb - Sistema de Licorería</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Link, usePage, router } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import { useTheme } from '@/composables/useTheme';
import { usePermissions } from '@/composables/usePermissions';

const props = defineProps({
    title: String,
    subtitle: String
});

const page = usePage();
const { currentTheme, currentContrast, darkMode, fontSize, themes, contrastLevels, setTheme, setContrast, setDarkMode, setFontSize, getThemeClasses } = useTheme();
const { tienePermiso, tieneAccesoModulo, esPropietario } = usePermissions();

const sidebarOpen = ref(false);
const searchQuery = ref('');
const showSearchResults = ref(false);
const searchResults = ref([]);
const selectedResultIndex = ref(-1);
const searchHistory = ref([]);
const isSearching = ref(false);
let searchTimeout = null;
const showThemeMenu = ref(false);
const showContrastMenu = ref(false);
const showDarkModeMenu = ref(false);

const themeClasses = computed(() => getThemeClasses());

// Contador de visitas de la página actual
const contadorPaginaActual = ref(page.props.visitas?.pagina_actual?.total || 0);
const contadorPaginaActualHoy = ref(page.props.visitas?.pagina_actual?.hoy || 0);
const nombrePaginaActual = ref(page.props.visitas?.pagina_actual?.nombre || 'Página');
const currentYear = new Date().getFullYear();

// Actualizar contador cuando cambia la página
watch(() => page.url, () => {
    // Actualizar contadores desde las props compartidas
    if (page.props.visitas?.pagina_actual) {
        contadorPaginaActual.value = page.props.visitas.pagina_actual.total || 0;
        contadorPaginaActualHoy.value = page.props.visitas.pagina_actual.hoy || 0;
        nombrePaginaActual.value = page.props.visitas.pagina_actual.nombre || 'Página';
    }
}, { immediate: true });
const currentThemeData = computed(() => themes[currentTheme.value] || themes.adultos);
const currentContrastData = computed(() => contrastLevels[currentContrast.value] || contrastLevels.normal);

const selectTheme = (themeName) => {
    setTheme(themeName);
    showThemeMenu.value = false;
};

const selectContrast = (contrastLevel) => {
    setContrast(contrastLevel);
    showContrastMenu.value = false;
};

const selectDarkMode = (isDark) => {
    setDarkMode(isDark);
    showDarkModeMenu.value = false;
};

// Aplicar tamaño de fuente cuando cambia el tema
watch([currentTheme, fontSize], ([newTheme, currentFontSize]) => {
    if (newTheme === 'adultos' && currentFontSize === 'normal') {
        setFontSize('large');
    } else if (newTheme !== 'adultos' && currentFontSize === 'large') {
        setFontSize('normal');
    }
}, { immediate: true });

// Cerrar menús al hacer clic fuera
const handleClickOutside = (e) => {
    if (!e.target.closest('[data-theme-menu]')) {
        showThemeMenu.value = false;
    }
    if (!e.target.closest('[data-contrast-menu]')) {
        showContrastMenu.value = false;
    }
    if (!e.target.closest('[data-dark-mode-menu]')) {
        showDarkModeMenu.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);

    // Cargar historial de búsquedas
    const savedSearchHistory = localStorage.getItem('searchHistory');
    if (savedSearchHistory) {
        try {
            searchHistory.value = JSON.parse(savedSearchHistory);
        } catch (e) {
            console.error('Error parsing search history:', e);
        }
    }

    // Guardar historial de búsquedas cuando cambie
    watch(searchHistory, (newHistory) => {
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }, { deep: true });

    // Registrar atajo de teclado global
    window.addEventListener('keydown', handleGlobalKeyDown);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);

    // Limpiar timeout de búsqueda
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    // Remover listener de teclado global
    window.removeEventListener('keydown', handleGlobalKeyDown);
});

const currentDate = computed(() => {
    return new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

const currentDateShort = computed(() => {
    return new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
});

const userInitials = computed(() => {
    const nombre = page.props.auth?.user?.nombre || '';
    const parts = nombre.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
});

const pageTitle = computed(() => {
    if (props.title) return props.title;

    const url = page.url;
    if (url.includes('/productos')) return 'Productos';
    if (url.includes('/categorias')) return 'Categorías';
    if (url.includes('/clientes')) return 'Clientes';
    if (url.includes('/ventas')) return 'Ventas';
    if (url.includes('/compras')) return 'Compras';
    //if (url.includes('/proveedores')) return 'Proveedores';
    if (url.includes('/inventario')) return 'Inventario';
    //if (url.includes('/creditos')) return 'Créditos';
    if (url.includes('/usuarios')) return 'Usuarios';
    if (url.includes('/roles')) return 'Roles';
    if (url.includes('/dashboard')) return 'Dashboard';
    if (url.includes('/pagos')) return 'Pagos';

    return 'Panel Administrativo';
});

const menuItems = computed(() => {
    const items = [];

    // Dashboard - verificar permiso
    if (tienePermiso('dashboard.ver')) {
        items.push({ href: route('admin.dashboard'), icon: '📊', label: 'Dashboard', description: 'Panel principal', permiso: 'dashboard.ver' });
    }

    // Productos
    if (tieneAccesoModulo('productos')) {
        items.push({ href: route('admin.productos.index'), icon: '📦', label: 'Productos', description: 'Gestionar productos', permiso: 'productos.listar' });
    }

    // Categorías
    if (tieneAccesoModulo('categorias')) {
        items.push({ href: route('admin.categorias.index'), icon: '🏷️', label: 'Categorías', description: 'Gestionar categorías', permiso: 'categorias.listar' });
    }

    // Clientes
    /* if (tieneAccesoModulo('clientes')) {
        items.push({ href: route('admin.clientes.index'), icon: '👥', label: 'Clientes', description: 'Gestionar clientes', permiso: 'clientes.listar' });
        if (tienePermiso('clientes.ver')) {
            items.push({ href: route('admin.clientes.verificar-documentos'), icon: '📋', label: 'Verificar Documentos', description: 'Revisar documentos de crédito', permiso: 'clientes.ver' });
        }
    } */

    // Ventas
    if (tieneAccesoModulo('ventas')) {
        items.push({ href: route('admin.ventas.index'), icon: '💰', label: 'Ventas', description: 'Ver ventas', permiso: 'ventas.listar' });
    }

    // Compras
    if (tieneAccesoModulo('compras')) {
        items.push({ href: route('admin.compras.index'), icon: '🛒', label: 'Compras', description: 'Ver compras', permiso: 'compras.listar' });
    }

    // Proveedores
    /* if (tieneAccesoModulo('proveedores')) {
        items.push({ href: route('admin.proveedores.index'), icon: '🏢', label: 'Proveedores', description: 'Gestionar proveedores', permiso: 'proveedores.listar' });
    } */

    // Inventario
    if (tieneAccesoModulo('inventario')) {
        items.push({ href: route('admin.inventario.index'), icon: '📊', label: 'Inventario', description: 'Control de inventario', permiso: 'inventario.listar' });
    }

    // Créditos
   /*  if (tieneAccesoModulo('creditos')) {
        items.push({ href: route('admin.creditos.index'), icon: '💳', label: 'Créditos', description: 'Gestionar créditos', permiso: 'creditos.listar' });
    } */

    // Estadísticas, Usuarios y Roles - verificar permisos
    if (tieneAccesoModulo('estadisticas')) {
        items.push({ href: route('admin.estadisticas.index'), icon: '📊', label: 'Estadísticas', description: 'Reportes y análisis', permiso: 'estadisticas.ver' });
    }
    if (tieneAccesoModulo('usuarios')) {
        items.push({ href: route('admin.usuarios.index'), icon: '👤', label: 'Usuarios', description: 'Gestionar usuarios', permiso: 'usuarios.listar' });
    }
    if (tieneAccesoModulo('roles')) {
        items.push({ href: route('admin.roles.index'), icon: '🔐', label: 'Roles', description: 'Gestionar roles', permiso: 'roles.listar' });
    }

    return items;
});

const allSearchableItems = computed(() => {
    const items = [...menuItems.value];

    // Agregar acciones según permisos (siempre verificar permisos, incluso para propietarios)
    if (tienePermiso('productos.crear')) {
        items.push({ href: route('admin.productos.create'), icon: '➕', label: 'Nuevo Producto', description: 'Crear nuevo producto' });
    }
    if (tienePermiso('ventas.crear')) {
        items.push({ href: route('admin.ventas.create'), icon: '➕', label: 'Nueva Venta', description: 'Registrar nueva venta' });
    }
    if (tienePermiso('compras.crear')) {
        items.push({ href: route('admin.compras.create'), icon: '➕', label: 'Nueva Compra', description: 'Registrar nueva compra' });
    }
    if (tienePermiso('clientes.crear')) {
        items.push({ href: route('admin.clientes.create'), icon: '➕', label: 'Nuevo Cliente', description: 'Registrar nuevo cliente' });
    }
    /* if (tienePermiso('clientes.ver')) {
        items.push({ href: route('admin.clientes.verificar-documentos'), icon: '📋', label: 'Verificar Documentos', description: 'Revisar documentos de crédito' });
    } */
    if (tienePermiso('categorias.crear')) {
        items.push({ href: route('admin.categorias.create'), icon: '➕', label: 'Nueva Categoría', description: 'Crear nueva categoría' });
    }
    /* if (tienePermiso('proveedores.crear')) {
        items.push({ href: route('admin.proveedores.create'), icon: '➕', label: 'Nuevo Proveedor', description: 'Registrar nuevo proveedor' });
    } */
    if (tienePermiso('inventario.ver')) {
        items.push({ href: route('admin.inventario.movimientos'), icon: '📋', label: 'Movimientos de Inventario', description: 'Ver movimientos' });
    }

    return items;
});

// Búsqueda difusa mejorada
const fuzzyMatch = (text, query) => {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    // Búsqueda exacta
    if (textLower.includes(queryLower)) return 3;

    // Búsqueda por palabras
    const words = queryLower.split(' ').filter(w => w.length > 0);
    const matches = words.filter(word => textLower.includes(word)).length;
    if (matches === words.length) return 2;

    // Búsqueda por caracteres consecutivos
    let textIndex = 0;
    for (let i = 0; i < queryLower.length; i++) {
        const char = queryLower[i];
        const foundIndex = textLower.indexOf(char, textIndex);
        if (foundIndex === -1) return 0;
        textIndex = foundIndex + 1;
    }
    return 1;
};

const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">$1</mark>');
};

const handleSearch = () => {
    // Limpiar timeout anterior
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    // Si la búsqueda es muy corta, mostrar historial o limpiar
    if (!searchQuery.value || searchQuery.value.length < 1) {
        searchResults.value = searchHistory.value.slice(0, 5).map(item => ({
            ...item,
            isHistory: true
        }));
        selectedResultIndex.value = -1;
        return;
    }

    // Debounce: esperar 300ms antes de buscar
    isSearching.value = true;
    searchTimeout = setTimeout(() => {
        const query = searchQuery.value.trim();

        if (query.length < 1) {
            searchResults.value = [];
            isSearching.value = false;
            return;
        }

        // Búsqueda mejorada con scoring
        const results = allSearchableItems.value
            .map(item => {
                const labelScore = fuzzyMatch(item.label, query);
                const descScore = fuzzyMatch(item.description, query);
                const hrefScore = item.href.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;

                const totalScore = labelScore * 3 + descScore * 2 + hrefScore;

                return {
                    ...item,
                    score: totalScore,
                    highlightedLabel: highlightMatch(item.label, query),
                    highlightedDescription: highlightMatch(item.description, query)
                };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8); // Limitar a 8 resultados

        searchResults.value = results;
        selectedResultIndex.value = -1;
        isSearching.value = false;
    }, 300);
};

const clearSearch = () => {
    searchQuery.value = '';
    searchResults.value = [];
    showSearchResults.value = false;
    selectedResultIndex.value = -1;
    isSearching.value = false;
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
};

const navigateTo = (href) => {
    // Guardar en historial
    const item = allSearchableItems.value.find(i => i.href === href);
    if (item) {
        const historyItem = {
            ...item,
            searchedAt: new Date().toISOString()
        };
        // Evitar duplicados
        searchHistory.value = searchHistory.value.filter(h => h.href !== href);
        searchHistory.value.unshift(historyItem);
        // Limitar historial a 10 items
        if (searchHistory.value.length > 10) {
            searchHistory.value = searchHistory.value.slice(0, 10);
        }
    }

    clearSearch();
    router.visit(href);
};

// Navegación con teclado
const handleKeyDown = (event) => {
    if (!showSearchResults.value || searchResults.value.length === 0) return;

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            selectedResultIndex.value = Math.min(
                selectedResultIndex.value + 1,
                searchResults.value.length - 1
            );
            break;
        case 'ArrowUp':
            event.preventDefault();
            selectedResultIndex.value = Math.max(selectedResultIndex.value - 1, -1);
            break;
        case 'Enter':
            event.preventDefault();
            if (selectedResultIndex.value >= 0 && searchResults.value[selectedResultIndex.value]) {
                navigateTo(searchResults.value[selectedResultIndex.value].href);
            } else if (searchResults.value.length > 0) {
                navigateTo(searchResults.value[0].href);
            }
            break;
        case 'Escape':
            clearSearch();
            break;
    }
};

// Atajo de teclado global (Ctrl+K / Cmd+K)
const handleGlobalKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Buscar"]');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
};


// Cerrar sidebar cuando cambia la ruta
watch(() => page.url, () => {
    sidebarOpen.value = false;
});

// Manejar responsive del sidebar
const handleResize = () => {
    if (window.innerWidth >= 1024) {
        sidebarOpen.value = false;
    }
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Verificar tamaño inicial
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
</script>

