import { FunctionComponent, ComponentType } from 'react';
import SummaryIcon from '@mui/icons-material/CommentOutlined';
import TranslateIcon from '@mui/icons-material/Translate';
import RewriteIcon from '@mui/icons-material/Replay';
import ExpandIcon from '@mui/icons-material/ExpandMore';
import ExplainIcon from '@mui/icons-material/MenuBook';
import CodeIcon from '@mui/icons-material/Code';

export interface AssistantElement {
    icon: String;
    title: string;
    description: string;
}

export let pinElementDefault: AssistantElement[] = [
    {
        icon: 'SummaryIcon',
        title: '摘要',
        description: '用原文语言概括这段文字:'
    },
    {
        icon: 'TranslateIcon',
        title: '翻译',
        description: '将这段文字翻译成 English:'
    }
];

let _pinElementCurrent: AssistantElement[] = [];
export const pinElementCurrent = {
    get: () => _pinElementCurrent,
    set: (value: AssistantElement[]) => {
        _pinElementCurrent = value;
    },
};

export const iconMap = {
    'SummaryIcon': SummaryIcon,
    'TranslateIcon': TranslateIcon,
    'RewriteIcon': RewriteIcon,
    'ExpandIcon': ExpandIcon,
    'ExplainIcon': ExplainIcon,
    'CodeIcon': CodeIcon,
    undefined: CodeIcon
}

export let commonElementDefault: AssistantElement[] = [
    {
        icon: 'SummaryIcon',
        title: '摘要',
        description: '用原文语言概括这段文字:'
    },
    {
        icon: 'TranslateIcon',
        title: '翻译',
        description: '将这段文字翻译成 English:'
    },
    {
        icon: 'RewriteIcon',
        title: '重写',
        description: '重新表述这段文字:'
    },
    {
        icon: 'ExpandIcon',
        title: '扩写',
        description: '详细说明这段文字:'
    },
    {
        icon: 'ExplainIcon',
        title: '解释说明',
        description: '解释这个文本并说明其中使用的任何技术术语:'
    },
    {
        icon: 'CodeIcon',
        title: '解释代码',
        description: '解释以下代码：'
    },
];