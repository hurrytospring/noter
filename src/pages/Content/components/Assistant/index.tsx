import React from 'react';
import {useEventCallback} from '@mui/material';
import {useEffect, useState} from 'react';
import IconButton from '@mui/material/IconButton';
import MoreIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Popper from '@mui/material/Popper';
import MainDialog from './MainDialog';
import { AssistantElement, pinElementDefault, iconMap } from './AssistantElement';
import PopMenu from './PopMenu';
import PinElementsContext from './PinElementsContext';

export default function Assistant() {
    const [anchorPosition, setAnchorPosition] = useState<{ left: number, top: number } | null>(null);
    const [openMainDialog, setOpenMainDialog] = useState(false);
    const [editorContent, setEditorContent] = useState("");
    const [mainDialogElement, setMainDialogElement] = useState(pinElementDefault[0]);
    const [previousAnchorPosition, setPreviousAnchorPosition] = useState<{ left: number, top: number } | null>(null);
    const [openPopover, setOpenPopover] = useState(false);
    const [lastSelection, setLastSelection] = useState("");
    const moreIconRef = React.useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [popperPlacement, setPopperPlacement] = useState(null);
    const [pinElements, setPinElements] = useState<AssistantElement[]>(pinElementDefault);
    const alignPopperRef = React.useRef(null);
    let menuCloseTimeoutId = null;

    function updatePopperPlacement(popoverRect){
        if (window.innerHeight / 2 > popoverRect.y){
            setPopperPlacement("bottom-start");
        }
        else{
            setPopperPlacement("top-start");
        }
    }

    function handleCloseDialog() {
        setOpenPopover(true);
        setAnchorPosition(previousAnchorPosition);
        setOpenMainDialog(false);
    }

    const handleSelectionChange = useEventCallback(() => {
        if (openMainDialog) {
            return;
        }
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && selection?.toString().length > 0) {
            const content = selection.toString();
            if (content === lastSelection) {
                return;
            }
            if (document.querySelector("#unique-popper")) {
                console.log("已有一个 Popper！");
                return;
            }
            setLastSelection(content);
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setAnchorPosition({
                left: rect.left,
                top: rect.bottom
            });
            updatePopperPlacement(rect);
            setOpenPopover(true);
            setEditorContent(content);
        } else {
            setAnchorPosition(null);
            setOpenPopover(false);
            setLastSelection("");
        }
    });

    useEffect(() => {
        document.addEventListener('mouseup', handleSelectionChange);
        return () => {
            document.removeEventListener('mouseup', handleSelectionChange);
        };
    }, [handleSelectionChange]);

    useEffect(() => {
        const elementKeys = Object.keys(localStorage).filter(key => key.startsWith('assistantElementPin'));
        if (!elementKeys.length) {
            setPinElements(pinElementDefault);
            pinElementDefault.forEach((element, index) => {
                localStorage.setItem(`assistantElementPin${index}`, JSON.stringify(element));
            });
        } else {
            const elements = elementKeys.map(key => {
                const item = localStorage.getItem(key);
                if (item) {
                    return JSON.parse(item);
                }
                return null;
            }).filter(element => element !== null);

            setPinElements(elements as AssistantElement[]);
        }
    }, []);

    function handleOpenMainDialog(element) {
        setPreviousAnchorPosition(anchorPosition);
        setAnchorPosition(null);
        setOpenPopover(false);
        setOpenMainDialog(true);
        setMainDialogElement(element)
    }

    const handleMenuOpen = (event) => {
        clearTimeout(menuCloseTimeoutId);
        event.persist();
        setTimeout(() => {
            setAnchorEl(moreIconRef.current);
        }, 200);
    };

    const handleMenuClose = () => {
        menuCloseTimeoutId = setTimeout(() => {
            setAnchorEl(null);
        }, 200);
    };

    return (
        <div>
            <Popper id="unique-popper"
                open={openPopover}
                placement={popperPlacement}
            >
                <div
                    ref={alignPopperRef}
                    style={{
                        position: 'absolute',
                        top: anchorPosition?.top | 0,
                        left: anchorPosition?.left | 0,
                        display: 'flex',
                        backgroundColor: 'white',
                        boxShadow: '0px 0px 2px rgba(0,0,0,0.2)',
                        borderRadius: '4px',
                        margin: '5px',
                        transform: 'translateY(5px)'
                    }}
                >
                    {pinElements.map((el: AssistantElement, index: number) => {
                        const Icon = iconMap[el.icon];
                        return (
                            <Tooltip key={index} title={el.title} placement="top" arrow>
                                <IconButton onClick={ () => handleOpenMainDialog(el)}>
                                    <Icon />
                                </IconButton>
                            </Tooltip>
                        );
                    })}
                    <IconButton
                        ref={moreIconRef}
                        onMouseEnter={handleMenuOpen}
                        onMouseLeave={handleMenuClose}
                    >
                        <MoreIcon/>
                    </IconButton>
                    <IconButton onClick={() => {
                        const selection = window.getSelection();
                        if (selection) {
                            selection.removeAllRanges();
                        }
                        setAnchorPosition(null);
                        setOpenPopover(false);
                    }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </div>
            </Popper>
            <PinElementsContext.Provider value={{pinElements, setPinElements}}>
            <MainDialog
                open={openMainDialog}
                onClose={handleCloseDialog}
                element={mainDialogElement}
                editorContent={editorContent}
                setEditorContent={setEditorContent}
            />
            </PinElementsContext.Provider>
            <PinElementsContext.Provider value={{pinElements, setPinElements}}>
            <PopMenu
                open={Boolean(anchorEl)}
                anchorEl={alignPopperRef.current}
                popperPlacement={popperPlacement}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
            />
            </PinElementsContext.Provider>
        </div>
    );
}
