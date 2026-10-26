export type RootScreen = 'Welcome' | 'Login' | 'Register' | 'Home';
export type RootNavigation = { currentScreen: RootScreen; navigate: (screen: RootScreen) => void; goBack: () => void };