import { NoxPlugin } from "@utils/user-data/types";
import { bookmarkPlugin } from "./bookmark/bookmark-plugin";
import { datetimePlugin } from "./datetime/datetime-plugin";
import { searchPlugin } from "./search/search-plugin";
import { calendarPlugin } from "./calendar/calendar-plugin";
import { notesPlugin } from "./notes/notes-plugin";
import { tasksPlugin } from "./tasks/tasks-plugin";
import { weatherPlugin } from "./weather/weather-plugin";
import { mathPlugin } from "./math/math-plugin";
import { bookPlugin } from "./book/book-plugin";
import { googleslidePlugin } from "./googleslide/google-slide";
import { googleformPlugin } from "./googleform/google-form";
import { googlecalenderPlugin } from "./googlecalender/google-calender";
import { googlemeetPlugin } from "./googlemeet/google-meet";
import { pomodoroPlugin } from "./pomodoro/pomodoro-plugin";
import { notionPlugin } from "./notion/notion";
import { googlekeepPlugin } from "./googlekeep/google-keep";
import { chatgptPlugin } from "./chatgpt/chatgpt";
import { spotifyPlugin } from "./spotify/spotify";
import { googlesheetPlugin } from "./googlesheet/google-sheet";

export const availablePlugins: NoxPlugin<any, any>[] = [
    bookmarkPlugin,
    datetimePlugin,
    notesPlugin,
    tasksPlugin,
    mathPlugin,
    searchPlugin,
    weatherPlugin,
    calendarPlugin,
    bookPlugin,
    googleslidePlugin,
    googleformPlugin,
    googlecalenderPlugin,
    googlemeetPlugin,
    pomodoroPlugin,
    notionPlugin,
    googlekeepPlugin,
    chatgptPlugin,
    spotifyPlugin,
    googlesheetPlugin
]

export const availablePluginsWithWidgets = availablePlugins.filter(p => p.widgets.length > 0);