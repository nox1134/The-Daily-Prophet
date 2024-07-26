import { Trans, useTranslation } from "react-i18next";
import "./Onboarding.scss";
import { ComponentProps, forwardRef, useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, m, useTransform } from "framer-motion";
import useMeasure from "react-use-motion-measure";
import { useHotkeys, usePrevious } from "@utils/hooks";
import { Button } from "./Button";
import { slidingScreensAnimation } from "./animations";
import {
  storage,
  useAtomWithStorage,
  useBrowserStorageValue,
} from "@utils/storage/api";
import { useFolderWidgets, useFolders } from "@utils/user-data/hooks";
import { Icon } from "./Icon";
import { analyticsEnabledAtom } from "@utils/analytics";
import { getIpInfo } from "@utils/network";
import {
  searchPlugin,
  searchWidgetDescriptor,
} from "@plugins/search/search-plugin";
import {
  tasksPlugin,
  tasksWidgetDescriptor,
} from "@plugins/tasks/tasks-plugin";
import {
  notesPlugin,
  notesWidgetDescriptor,
} from "@plugins/notes/notes-plugin";
import {
  datetimePlugin,
  datetimeWidgetDescriptorS,
} from "@plugins/datetime/datetime-plugin";
import {
  weatherPlugin,
  weatherWidgetDescriptorCurrent,
} from "@plugins/weather/weather-plugin";
import {
  GridDimensions,
  LayoutItemSize,
  Position,
  canPlaceItemInGrid,
} from "@utils/grid";
import { NoxPlugin, WidgetDescriptor } from "@utils/user-data/types";
import { useMotionTransition } from "@utils/motion/hooks";
import { useDirection } from "@radix-ui/react-direction";

const screens = ["presets"] as const;

const Section = forwardRef<HTMLDivElement, ComponentProps<typeof m.section>>(
  ({ ...props }, ref) => {
    return (
      <m.section
        variants={slidingScreensAnimation}
        ref={ref}
        initial="initial"
        animate="show"
        exit="hide"
        {...props}
      />
    );
  }
);

const navigationButtonVariants = {
  initial: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
};

export const Onboarding = ({
  gridDimensions,
}: {
  gridDimensions: GridDimensions;
}) => {
  const applyPreset = async () => {
    const addIfPossible = <T extends {}>({
      plugin,
      widget,
      config,
      position,
      size,
    }: {
      widget: WidgetDescriptor<T>;
      plugin: NoxPlugin<any, T>;
      config: T;
      position: Position;
      size?: LayoutItemSize;
    }) => {
      if (
        canPlaceItemInGrid({
          grid: gridDimensions,
          layout: [],
          item: widget.appearance.size,
          position,
        })
      ) {
        addWidget({
          plugin,
          widget,
          config,
          position,
          size,
        });
      }
    };

    console.log("Applying preset");
    const ipInfo = await getIpInfo();
    console.log("Ip info", ipInfo);

    addIfPossible({
      plugin: searchPlugin,
      widget: searchWidgetDescriptor,
      config: {
        defaultProvider: "google",
      },
      position: {
        x: 0,
        y: 0,
      },
    });
    addIfPossible({
      plugin: tasksPlugin,
      widget: tasksWidgetDescriptor,
      config: {
        title: t("tasks-plugin.todo"),
      },
      position: {
        x: 1,
        y: 0,
      },
    });

    addIfPossible({
      plugin: notesPlugin,
      widget: notesWidgetDescriptor,
      config: {},
      position: {
        x: 2,
        y: 0,
      },
      size: {
        width: 2,
        height: 2,
      },
    });

    addIfPossible({
      plugin: datetimePlugin,
      widget: datetimeWidgetDescriptorS,
      config: {
        title: ipInfo.city,
        tz: ipInfo.timezone,
        timeFormat: "HH:mm",
        dateFormat: "Do MMM Y",
      },
      position: {
        x: 4,
        y: 0,
      },
    });

    if (ipInfo.lat !== undefined && ipInfo.long !== undefined) {
      addIfPossible({
        plugin: weatherPlugin,
        widget: weatherWidgetDescriptorCurrent,
        config: {
          location: {
            id: 0,
            country: ipInfo.country,
            name: ipInfo.city,
            latitude: ipInfo.lat,
            longitude: ipInfo.long,
          },
          temperatureUnit: "c",
          speedUnit: "km/h",
        },
        position: {
          x: 6,
          y: 0,
        },
      });
    }
  };

  const { t } = useTranslation();
  const [language, setLanguage] = useBrowserStorageValue("language", "en");
  const [analyticsEnabled, setAnalyticsEnabled] =
    useAtomWithStorage(analyticsEnabledAtom);

  const [screenIndex, setScreenIndex] = useState<number>(0);
  const prevScreen = usePrevious(screenIndex) || 0;
  const shouldAnimateScreenChange = Math.abs(prevScreen - screenIndex) <= 1;
  const direction = !shouldAnimateScreenChange
    ? "none"
    : prevScreen <= screenIndex
    ? "right"
    : "left";

  const screenName = screens[screenIndex];

  const { activeFolder } = useFolders({ includeHome: true });
  const { addWidget } = useFolderWidgets(activeFolder);

  const [ref, bounds] = useMeasure();
  const animatedHeight = useMotionTransition(bounds.height, {
    type: "tween",
    duration: 0.15,
    ignoreInitial: true,
  });

  useHotkeys(
    "right",
    () => {
      if (screenIndex < screens.length - 1) {
        setScreenIndex(screenIndex + 1);
      }
    },
    undefined,
    [screenIndex]
  );
  useHotkeys(
    "left",
    () => {
      if (screenIndex > 0) {
        setScreenIndex(screenIndex - 1);
      }
    },
    undefined,
    [screenIndex]
  );

  useEffect(() => {
    const main = async () => {
      const finishedOnboarding = await storage.getOne("finishedOnboarding");
      if (finishedOnboarding) {
        setScreenIndex(screens.length - 1);
      }
    };

    main();
  }, []);

  useEffect(() => {
    if (screenIndex === screens.length - 1) {
      storage.setOne("finishedOnboarding", true);
    }
  }, [screenIndex]);

  // Need this to avoid initial flash when animatedHeight is 0
  const animatedHeightCorrected = useTransform(animatedHeight, (val) =>
    val === 0 ? undefined : val
  );
  const dir = useDirection();

  return (
    <div className="Onboarding">
      <LayoutGroup>
        <m.div
          className="content-wrapper"
          style={{
            height: animatedHeightCorrected,
          }}
        >
          <m.div className="content" ref={ref}>
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              {screenName === "presets" && (
                <Section custom={direction} key="presets">
                  <Button className="preset" onClick={() => applyPreset()}>
                    {t("onboarding.presets.cta")}
                  </Button>
                </Section>
              )}
            </AnimatePresence>
          </m.div>
        </m.div>
        <m.div className="navigation-buttons" layout>
          <AnimatePresence initial={false}>
            {screenIndex !== 0 && (
              <Button
                variants={navigationButtonVariants}
                initial="initial"
                animate="show"
                exit="hide"
                key="back-btn"
                onClick={() => setScreenIndex((p) => p - 1)}
              >
                <Icon
                  icon={
                    dir === "ltr" ? "ion:chevron-back" : "ion:chevron-forward"
                  }
                  width={24}
                  height={24}
                />{" "}
                {t("back")}
              </Button>
            )}
            <div className="spacer"></div>
            {screenIndex !== screens.length - 1 && (
              <Button
                variants={navigationButtonVariants}
                initial="initial"
                animate="show"
                exit="hide"
                key="next-btn"
                onClick={() => {
                  setScreenIndex((p) => p + 1);
                }}
              >
                {t("next")}{" "}
                <Icon
                  icon={
                    dir === "ltr" ? "ion:chevron-forward" : "ion:chevron-back"
                  }
                  width={24}
                  height={24}
                />
              </Button>
            )}
          </AnimatePresence>
        </m.div>
      </LayoutGroup>
    </div>
  );
};
