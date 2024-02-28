import React, {FC, useContext} from 'react';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { grey } from '@mui/material/colors';
import {AssistantElement, commonElementDefault, iconMap, pinElementDefault} from './AssistantElement';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PinElementsContext from "./PinElementsContext";

interface PopMenuProps {
    open: boolean;
    anchorEl: any;
    popperPlacement: any;
    handleMenuOpen: (event: any) => void;
    handleMenuClose: () => void;
}

const PopMenu: FC<PopMenuProps> = ({open, anchorEl, popperPlacement, handleMenuOpen, handleMenuClose}) => {
    const {pinElements, setPinElements} = useContext(PinElementsContext);

    const handleClick = (element: AssistantElement) => {
        let newPinElements;
        if (pinElements.some(e => e.title === element.title && e.icon === element.icon)) {
            newPinElements = pinElements.filter(e => !(e.title === element.title && e.icon === element.icon));
        } else {
            newPinElements = [...pinElements];
            newPinElements.push(element);
        }

        setPinElements(newPinElements);
        // 清空已存的assistantElementPin，防止存储空元素
        Object.keys(localStorage)
            .filter(key => key.startsWith('assistantElementPin'))
            .forEach(key => localStorage.removeItem(key));
        // 更新localStorage
        newPinElements.forEach((element, index) => {
            localStorage.setItem(`assistantElementPin${index}`, JSON.stringify(element));
        });

    }
    return (
        <Popper
            elevation={1}
            open={open}
            anchorEl={anchorEl}
            style={{width: 200, zIndex: 1400}}
            disablePortal
            placement={popperPlacement}
            onMouseEnter={handleMenuOpen}
            onMouseLeave={handleMenuClose}
            modifiers={[
                {
                    name: 'offset',
                    options: {
                        offset: [0, 5],
                    },
                },
            ]}
        >
            <Paper>
                <MenuItem style={{display: 'flex', flexDirection: 'row', justifyContent: "space-between", padding: '10px 8px'}}>
                    <Typography variant="inherit" style={{ color: grey[500] }}>快捷指令</Typography>
                    <IconButton color="secondary" size="small">
                        <AddIcon fontSize="small" />
                    </IconButton>
                </MenuItem>
                {commonElementDefault.map((element, index) => {
                    const Icon = iconMap[element.icon];
                    let isPinned = pinElements.some(e => e.title === element.title && e.icon === element.icon);
                    return (
                        <MenuItem key={index} style={{display: 'flex', flexDirection: 'row', justifyContent: "space-between", padding: '5px 0px'}}>
                            <ListItemIcon style={{ justifyContent: "center", minWidth: 35 }}>
                                <Icon style={{ fontSize: 18 }}/>
                            </ListItemIcon>
                            <Typography variant="inherit" style={{ fontSize: 14, flexGrow: 1, marginLeft: '0px' }}>{element.title}</Typography>
                            <ListItemIcon>
                                {isPinned ? <PushPinIcon fontSize="small" onClick={() => handleClick(element)}/>
                                    : <PushPinOutlinedIcon fontSize="small" onClick={() => handleClick(element)}/>}
                            </ListItemIcon>
                        </MenuItem>
                    )
                })}
            </Paper>
        </Popper>
    );
};
export default PopMenu;
