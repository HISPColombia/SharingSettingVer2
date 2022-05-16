import { createTheme} from '@mui/material/styles';

import {
    blue,
    grey,
    orange,
   // darkBlack,
    red,
   // white,
} from '@mui/material/colors';
const blue100=blue[100];
const blue500=blue[500];
const blue700=blue[700];
const grey100=grey[100];
const grey300=grey[300];
const grey400=grey[400];
const grey600=grey[600];
const grey800=grey[800];
const orange500=orange[500];
const orangeA200=orange["A200"];
const red400=red[400];
const red100=red[100];
const darkBlack=grey[900];
const white='#ffff';
const theme = {
    spacing: 2,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary: {
            main:blue[500],
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
            disabledColor: grey300,
            error:red400,
            tabs:{backgroundColor:grey300,
                selectedTextColor:grey800,
                textColor:grey800
                },
            settingOptions:{
                icon:grey600,
                title:grey400        
            },
            forms: {
                minWidth: 350,
                maxWidth: 750,
            },
            formInput: {
                fontWeight: 100,
            }
        },
        secondary: {
            main:blue[500]
        }

    }
    
};

const muiTheme = createTheme(theme);

export default muiTheme;