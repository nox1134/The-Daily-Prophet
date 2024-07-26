//import browser from 'webextension-polyfill';
import { useFolders } from '@utils/user-data/hooks';
import './Settings.scss';
import { AnimatePresence,m } from 'framer-motion';
import { Button } from '@components/Button';
import { Icon } from '@components/Icon';
import { homeFolder } from '@utils/user-data/types';
import { ScrollArea } from '@components/ScrollArea';
import { ComponentProps, Suspense, lazy } from 'react';
import { FolderItem } from './FolderItem';
import { atom, useSetAtom } from 'jotai';
import { Modal } from '@components/Modal';
import { useTranslation } from 'react-i18next';
import { useDirection } from '@radix-ui/react-direction';

export const ReorderGroup = lazy(() => import('@utils/motion/lazy-load-reorder').then(m => ({ default: m.ReorderGroup })));

const currentScreenAtom = atom<'folders'>('folders');

const FoldersScreen = (props: ComponentProps<typeof m.div>) => {
    const { folders, setFolders, createFolder, updateFolder, removeFolder } = useFolders();
    const { t } = useTranslation();

    return (
        <m.div {...props} className='FoldersScreen'>
            <m.div>
                <FolderItem folder={homeFolder} />
                <Suspense>
                    <ReorderGroup axis="y" values={folders} onReorder={setFolders} as="div">
                        {folders.map((f, index) => (
                            <FolderItem
                                key={f.id}
                                folder={f}
                                editable
                                onNameChange={name => updateFolder(f.id, { name })}
                                onIconChange={icon => updateFolder(f.id, { icon })}
                                onRemove={() => removeFolder(f.id)}
                            />
                        ))}
                    </ReorderGroup>
                </Suspense>
            </m.div>

            <Button className='add-folder-btn' onClick={() => createFolder()}>
                <Icon icon='ion:add' height={24} /> {t('settings.folders.createNew')}
            </Button>
        </m.div>
    );
};

export const SettingsModal = ({ onClose }: { onClose: () => void }) => {
    const { t } = useTranslation();
    const setScreen = useSetAtom(currentScreenAtom);
    const dir = useDirection();

    const screen = 'folders';

    const folderScreenEnter = { x: dir === 'ltr' ? '0%' : '0%', opacity: 0 };
    const folderScreenExit = { x: dir === 'ltr' ? '0%' : '0%', opacity: 0 };
    const transition = { duration: 0.18 };

    return (
        <Modal
            title={t('settings.folders.title')}
            className='SettingsModal'
            closable onClose={() => {
                onClose();
                setScreen('folders');
            }}
            headerButton={screen !== 'folders' ? <Button withoutBorder onClick={() => setScreen('folders')}><Icon icon={dir === 'ltr' ? 'ion:arrow-back' : 'ion:arrow-forward'} width={24} height={24} /></Button> : undefined}
        >
            <ScrollArea className='Settings'>
                <div className="settings-content">
                    <AnimatePresence initial={false} mode='wait'>
                        {screen === 'folders' && <FoldersScreen key='folders' initial={folderScreenEnter} animate={{ x: 0, opacity: 1 }} exit={folderScreenExit} transition={transition} />}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        </Modal>
    );
};
