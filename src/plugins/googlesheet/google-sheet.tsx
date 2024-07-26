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
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSHVibBE_CAQr_jdSmc1AXm6Let83pT6e1BgCDlezr2y2NXkKOq1yT73E_BGyOwG64Y7iKEd_SOPMd-/pubhtml?widget=true&amp;headers=false"
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
          placeholder="https://docs.google.com/spreadsheets/d/e/2PACX-1vSHVibBE_CAQr_jdSmc1AXm6Let83pT6e1BgCDlezr2y2NXkKOq1yT73E_BGyOwG64Y7iKEd_SOPMd-/pubhtml?widget=true&amp;headers=false"
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

const GooglesheetPlugin = ({
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
    return translate("google-sheet.widgetName");
  },
  configurationScreen: PictureConfigScreen,
  mainScreen: GooglesheetPlugin,
  mock: () => {
    return (
      <GooglesheetPlugin
        instanceId="mock"
        config={{
          url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSHVibBE_CAQr_jdSmc1AXm6Let83pT6e1BgCDlezr2y2NXkKOq1yT73E_BGyOwG64Y7iKEd_SOPMd-/pubhtml?widget=true&amp;headers=false",
        }}
      />
    );
  },
  appearance: {
    withoutPadding: true,
    size: {
      width: 3,
      height: 4,
    },
    resizable: true,
  },
} as const satisfies WidgetDescriptor<any>;

export const googlesheetPlugin = {
  id: "google-sheet",
  get name() {
    return translate("google-sheet");
  },
  widgets: [widgetDescriptor],
  configurationScreen: null,
} satisfies NoxPlugin;
