import { useState } from 'react';
import Paper from '@mui/material/Paper';
import { Menu } from '@dhis2-ui/menu'
import { MenuItem } from '@dhis2-ui/menu'
import { MenuDivider } from '@dhis2-ui/menu'
import TextField from '@mui/material/TextField';
import ListItemIcon from '@mui/material/ListItemIcon';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box'
//DHIS2 component
import i18n from '../locales/index.js'
// Styles
require('../scss/app.scss');
function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

// export default ({sections,currentSection,onChangeSection,onChangeSearchText}) => {
//     return(
//     <div className="sidebar">
//         <Box sx={{ padding:1}}>
//             <TextField onChange={(e)=>onChangeSearchText(e.target.value)} fullWidth={true}  label={i18n.t("search")} variant="standard"  />
//         </Box>

//     <Divider/>
//     <Menu >
//             {sections.map(s=>(<MenuItem className={currentSection===s.key?"sidebar-menuitem-selected":"sidebar-menuitem"}  onClick={()=>onChangeSection(s.key,"")} label={s.label}  icon={<FolderOpenIcon />}/>))}
//     </Menu>
//     </div>
// )}

export default ({ sections, currentSection, onChangeSection, onChangeSearchText }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className="sidebar">
            <Box sx={{ padding: 1 }}>
                <TextField onChange={(e) => onChangeSearchText(e.target.value)} fullWidth={true} label={i18n.t("search")} variant="standard" />
            </Box>
            <Box
                sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 520 }}
            >

                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider'}}
                >
                    {sections.map(s => (<Tab className={currentSection === s.key ? "sidebar-menuitem-selected" : "sidebar-menuitem"} onClick={() => onChangeSection(s.key, "")} label={s.label} iconPosition="start" icon={<FolderOpenIcon />} />))}        </Tabs>
            </Box>
        </div>)
};