export const setThemePreference = () => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = prefersDarkScheme ? "dark" : "light";
    localStorage.setItem("theme", theme);
    return theme;
  };
  
  export const getThemePreference = () => {
    return localStorage.getItem("theme") || "light";
  };