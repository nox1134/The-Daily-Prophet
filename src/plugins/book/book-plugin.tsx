import { Button } from "@components/Button";
import { NoxPlugin, WidgetConfigurationScreenProps, WidgetRenderProps, WidgetDescriptor } from "@utils/user-data/types";
import './styles.scss';
import { translate } from "@translations/index";
import { useTranslation } from "react-i18next";
import { Input } from "@components/Input";
import { useState } from "react";

type BookPluginWidgetConfigType = {
    url: string
};

const BookConfigScreen = ({ saveConfiguration, currentConfig }: WidgetConfigurationScreenProps<BookPluginWidgetConfigType>) => {
    const { t } = useTranslation();
    const [url, setUrl] = useState(currentConfig?.url ?? 'https://source.unsplash.com/random/512x512');

    const onConfirm = () => {

        saveConfiguration({
            url: url,
        });
    };


    return (<div className="BookWidget-config">
        <div className="field">
                <label>{t('url')}:</label>
                <Input placeholder='https://example.com/image.jpg' value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>

        <Button className="save-config" onClick={onConfirm}>{t('save')}</Button>
    </div>);
};

const BookPlugin = ({ config, instanceId }: WidgetRenderProps<BookPluginWidgetConfigType>) => {
    return (<div className="BookWidget">
        <img className="Image" src={config.url} />
    </div>);
};

const widgetDescriptor = {
    id: 'widget',
    get name() {
        return translate('book-plugin.widgetName');
    },
    configurationScreen: BookConfigScreen,
    mainScreen: BookPlugin,
    mock: () => {
        return (<BookPlugin instanceId="mock" config={{
            url: 'https://source.unsplash.com/random/512x512'
        }} />)
    },
    appearance: {
        withoutPadding: true,
        size: {
            width: 2,
            height: 2,
        },
        resizable: true,
    }
} as const satisfies WidgetDescriptor<any>;

export const bookPlugin = {
    id: 'book-plugin',
    get name() {
        return translate('book-plugin.name');
    },
    widgets: [
        widgetDescriptor,
    ],
    configurationScreen: null,
} satisfies NoxPlugin;