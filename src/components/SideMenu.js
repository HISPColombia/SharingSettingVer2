import { useState } from 'react';
import TextField from '@mui/material/TextField';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box'
//DHIS2 component
import i18n from '../locales/index.js'
// Styles
import '../scss/app.scss';
function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default ({ sections, currentSection, onChangeSection, onChangeSearchText }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className="sidebar">
            <Box sx={{ paddingTop:1,paddingLeft:2,paddingRight:5,paddingBottom:1 }}>
                <TextField onChange={(e) => onChangeSearchText(e.target.value)} fullWidth={true} label={i18n.t("search")} variant="standard" />
            </Box>
            <Box
                sx={{ flexGrow: 1, display: 'flex', height: '90%' }}
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