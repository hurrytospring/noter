import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import SummaryIcon from '@mui/icons-material/CommentOutlined';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/system';
import {
  AssistantElement,
  iconMap,
  pinElementDefault,
} from './AssistantElement';
// import {ICommonChatCompletionMessage} from "../../../renderer/lib/chat/types";
// import {llmChatStream} from "../../../renderer/lib/chat/utils";

import SummaryIcon from '@mui/icons-material/CommentOutlined';
import PinElementsContext from './PinElementsContext';

const StyledButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  borderColor: '#DADCE0',
  color: '#3C4043',
  backgroundColor: '#F8F9FA',
  '&:hover': {
    backgroundColor: '#F8F9FA',
    borderColor: '#DADCE0',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#F8F9FA',
    borderColor: '#DADCE0',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
});

interface MainDialogProps {
  open: boolean;
  onClose: () => void;
  element: AssistantElement;
  editorContent: string;
  setEditorContent: (content: string) => void;
}

const MainDialog: FC<MainDialogProps> = ({
  open,
  onClose,
  element,
  editorContent,
  setEditorContent,
}) => {
  const [localEditorContent, setLocalEditorContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { pinElements, setPinElements } = useContext(PinElementsContext);

  async function wordSelection(prompt: string, selection: string) {
    let messages: ICommonChatCompletionMessage[] = [];
    messages.push({ role: 'user', content: prompt + selection });
    const rep = await llmChatStream([...messages], undefined);
    return rep.stream;
  }
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (open) {
      setLocalEditorContent('请稍后...');
      // ipc调用没法传递stream，直接调用
      //            const sideBarClient = window.buildSideBarClient();
      wordSelection(element.description, editorContent)
        .then((observable) => {
          observable.subscribe({
            next: (result) => {
              setLocalEditorContent(result);
            },
            error: (err) => console.error('Error: ', err),
          });
        })
        .catch((err) => console.error('Error: ', err));
    } else {
      setLocalEditorContent('');
    }
  }, [open, editorContent]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      BackdropProps={{ style: { backgroundColor: 'transparent' } }}
      PaperProps={{
        style: {
          width: '80vw',
          minHeight: '45vh',
          maxHeight: '90vh',
          maxWidth: 'none',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <SummaryIcon />
            <Typography variant="h6" paddingLeft={2}>
              {element.title}
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box>
          <div>
            {pinElements.map((el: AssistantElement, index: number) => {
              const Icon = iconMap[el.icon];
              return (
                <StyledButton
                  key={index}
                  variant="outlined"
                  startIcon={<Icon />}
                >
                  {el.title}
                </StyledButton>
              );
            })}
          </div>
        </Box>
        <Typography
          variant="subtitle2"
          align="left"
          style={{ margin: '8px 0 0 0' }}
        >
          原文
        </Typography>
        <TextField
          value={editorContent}
          multiline
          fullWidth
          readOnly
          onClick={handleClick}
          style={{ margin: '8px 0' }}
          inputProps={{
            style: {
              overflow: 'auto',
              resize: 'none',
              color: '#808080',
              maxHeight: isExpanded ? 'none' : '3.75rem',
            },
            onFocus: (e) => e.target.blur(),
          }}
        />
        <Typography
          variant="subtitle2"
          align="left"
          style={{ margin: '8px 0' }}
        >
          结果
        </Typography>
        <TextField
          value={localEditorContent}
          multiline
          fullWidth
          style={{ margin: '8px 0' }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MainDialog;
