
import Spacing from 'material-ui/styles/spacing';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {
    blue100,
    blue500,
    blue700,
    grey100,
    grey300,
    grey400,
    grey600,
    grey800,
    orange500,
    orangeA200,
    darkBlack,
    red400,
    white,
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import { red100 } from 'material-ui/styles/colors';

const theme = {
    spacing: Spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: blue500,
        primary2Color: blue700,
        primary3Color: blue100,
        accent1Color: orange500,
        accent2Color: grey100,
        accent3Color: orangeA200,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey400,
        disabledColor: fade(darkBlack, 0.3),
        error:red400
    },
    tabs:{backgroundColor:grey300,
        selectedTextColor:grey800,
        textColor:grey800
        },
    settingOptions:{
        icon:grey600,
        title:grey400        
    }
};

const muiTheme = getMuiTheme(theme);

export default Object.assign({}, muiTheme, {
    forms: {
        minWidth: 350,
        maxWidth: 750,
    },
    formInput: {
        fontWeight: 100,
    },
});
