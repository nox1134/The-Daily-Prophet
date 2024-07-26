import { Button } from "@components/Button";
import { NoxPlugin, WidgetConfigurationScreenProps, WidgetRenderProps } from "@utils/user-data/types";
import { useState, useEffect, useMemo } from "react";
import './styles.scss';
import { Icon } from "@components/Icon";
import clsx from "clsx";
import moment from "moment-timezone";
import { AnimatePresence, m } from "framer-motion";
import { usePrevious } from "@utils/hooks";
import { Select } from "@components/Select";
import { useTranslation } from "react-i18next";
import { translate } from "@translations/index";
import { capitalize } from "@utils/strings";
import { useDirection } from "@radix-ui/react-direction";

type PomodoroConfigType = {
  workDuration: number;
  breakDuration: number;
};

const ConfigScreen = ({ currentConfig, saveConfiguration }: WidgetConfigurationScreenProps<PomodoroConfigType>) => {
  const { t } = useTranslation();
  const [workDuration, setWorkDuration] = useState<number>(currentConfig?.workDuration ?? 25);
  const [breakDuration, setBreakDuration] = useState<number>(currentConfig?.breakDuration ?? 5);

  return (
    <div className='Pomodoro-config'>
      <div>
        <label>{t('Work Duration')}:</label>
        <Select<number>
          options={[15, 20, 25, 30, 35, 40, 45, 50, 55, 60]}
          value={workDuration}
          onChange={setWorkDuration}
          getOptionKey={o => o.toString()}
          getOptionLabel={o => `${o} minutes`}
        />
      </div>
      <div>
        <label>{t('Break Duration')}:</label>
        <Select<number>
          options={[5, 10, 15, 20, 25, 30]}
          value={breakDuration}
          onChange={setBreakDuration}
          getOptionKey={o => o.toString()}
          getOptionLabel={o => `${o} minutes`}
        />
      </div>
      <Button className='save-config' onClick={() => saveConfiguration({ workDuration, breakDuration })}>{t('save')}</Button>
    </div>
  );
};

const MainScreen = ({ config, instanceId }: WidgetRenderProps<PomodoroConfigType>) => {
  const { t } = useTranslation();
  const [isWorking, setIsWorking] = useState(true);
  const [timeLeft, setTimeLeft] = useState(config.workDuration * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (running) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            clearInterval(timer);
            setIsWorking(!isWorking);
            setTimeLeft(isWorking ? config.breakDuration * 60 : config.workDuration * 60);
            return isWorking ? config.breakDuration * 60 : config.workDuration * 60;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [running, isWorking, config.workDuration, config.breakDuration]);

  const toggleRunning = () => setRunning(!running);
  const resetTimer = () => {
    setRunning(false);
    setIsWorking(true);
    setTimeLeft(config.workDuration * 60);
  };

  return (
    <div className="Pomodoro">
      <h3 className="header">{isWorking ? t('Pomodoro-Timer') : t('break')}</h3>
      <div className="timer">
        {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
        {Math.floor(timeLeft % 60).toString().padStart(2, '0')}
      </div>
      <Button onClick={toggleRunning}>
        {running ? t('Pause') : t('Start')}
      </Button>
      <Button onClick={resetTimer}>{t('Reset')}</Button>
    </div>
  );
};

const widgetDescriptor = {
  id: 'pomodoro-m',
  get name() {
    return translate('widgetName')
  },
  configurationScreen: ConfigScreen,
  withAnimation: false,
  mainScreen: MainScreen,
  mock: () => {
    return (<MainScreen instanceId="mock" config={{ workDuration: 25, breakDuration: 5 }} />)
  },
  appearance: {
    resizable: false,
    size: {
      width: 2,
      height: 2,
    }
  }
} as const;

export const pomodoroPlugin = {
  id: 'pomodoro-plugin',
  get name() {
    return translate('name');
  },
  widgets: [
    widgetDescriptor,
  ],
  configurationScreen: null,
} satisfies NoxPlugin;
