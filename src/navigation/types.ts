export type RootScreen = 'Welcome' | 'Login' | 'Register' | 'Home'| 'Calendar';
export type RootNavigation = { currentScreen: RootScreen; navigate: (screen: RootScreen) => void; goBack: () => void };