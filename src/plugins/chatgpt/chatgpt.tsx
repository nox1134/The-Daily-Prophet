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
  const [url, setUrl] = useState(currentConfig?.url ?? "https://chatgpt.com/");

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
          placeholder="https://chatgpt.com/"
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

const ChatgptPlugin = ({
  config,
  instanceId,
}: WidgetRenderProps<PicturePluginWidgetConfigType>) => {
  const redirect3 = () => {
    window.open(config.url, "_blank");
  };

  return (
    <div className="PictureWidget">
      <button id="chatgpt" onClick={redirect3}>
        <img
          src="https://swipefile.com/wp-content/uploads/2023/08/chatgpt-logo-chat-gpt-1024x1024.png"
          alt="chatgpt"
          width="80%"
        />
      </button>
    </div>
  );
};

const widgetDescriptor = {
  id: "widget",
  get name() {
    return translate("chatgpt.widgetName");
  },
  configurationScreen: PictureConfigScreen,
  mainScreen: ChatgptPlugin,
  mock: () => {
    return (
      <ChatgptPlugin
        instanceId="mock"
        config={{
          url: "https://chatgpt.com/",
        }}
      />
    );
  },
  appearance: {
    withoutPadding: true,
    size: {
      width: 1,
      height: 1,
    },
    resizable: true,
  },
} as const satisfies WidgetDescriptor<any>;

export const chatgptPlugin = {
  id: "chatgpt",
  get name() {
    return translate("chatgpt");
  },
  widgets: [widgetDescriptor],
  configurationScreen: null,
} satisfies NoxPlugin;
