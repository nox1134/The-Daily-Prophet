import { Button } from "@components/Button";
import {
  NoxPlugin,
  WidgetConfigurationScreenProps,
  WidgetRenderProps,
  WidgetDescriptor,
} from "@utils/user-data/types";
import "./styles.scss";
import { translate } from "@translations/index";
import { useTranslation } from "react-i18next";
import { Input } from "@components/Input";
import { useState } from "react";

type PicturePluginWidgetConfigType = {
  url: string;
};

const PictureConfigScreen = ({
  saveConfiguration,
  currentConfig,
}: WidgetConfigurationScreenProps<PicturePluginWidgetConfigType>) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState(
    currentConfig?.url ??
      "https://calendar.google.com/calendar/embed?src=6ac6ae79a2341c21e3543bbf904b2013656681b2802279c552346010f52271bc%40group.calendar.google.com&ctz=UTC"
  );

  const onConfirm = () => {
    saveConfiguration({
      url: url,
    });
  };

  return (
    <div className="PictureWidget-config">
      <div className="field">
        <label>{t("url")}:</label>
        <Input
          placeholder="https://calendar.google.com/calendar/embed?src=6ac6ae79a2341c21e3543bbf904b2013656681b2802279c552346010f52271bc%40group.calendar.google.com&ctz=UTC"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <Button className="save-config" onClick={onConfirm}>
        {t("save")}
      </Button>
    </div>
  );
};

const GooglecalenderPlugin = ({
  config,
  instanceId,
}: WidgetRenderProps<PicturePluginWidgetConfigType>) => {
  return (
    <div className="PictureWidget">
      <iframe
        className="GoogleSlide"
        src={config.url}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const widgetDescriptor = {
  id: "widget",
  get name() {
    return translate("google-calender.widgetName");
  },
  configurationScreen: PictureConfigScreen,
  mainScreen: GooglecalenderPlugin,
  mock: () => {
    return (
      <GooglecalenderPlugin
        instanceId="mock"
        config={{
          url: "https://calendar.google.com/calendar/embed?src=6ac6ae79a2341c21e3543bbf904b2013656681b2802279c552346010f52271bc%40group.calendar.google.com&ctz=UTC",
        }}
      />
    );
  },
  appearance: {
    withoutPadding: true,
    size: {
      width: 2,
      height: 2,
    },
    resizable: true,
  },
} as const satisfies WidgetDescriptor<any>;

export const googlecalenderPlugin = {
  id: "google-calender",
  get name() {
    return translate("google-calender");
  },
  widgets: [widgetDescriptor],
  configurationScreen: null,
} satisfies NoxPlugin;
