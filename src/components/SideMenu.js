import Paper from '@mui/material/Paper';
import { Menu } from '@dhis2-ui/menu'
import { MenuItem } from '@dhis2-ui/menu'
import { MenuDivider } from '@dhis2-ui/menu'
import TextField from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import Divider from '@mui/material/Divider';
import { Box } from '@mui/system';
export default ({sections,currentSection,onChangeSection}) => {
    return(
    <Paper sx={{  background: '#f3f3f3', width: 320,height:800,overflow: 'scroll'}}>
    <Box>
        <TextField id="filled-basic" label="Filled" variant="filled" />
    </Box>
    
    <Divider/>
    <Menu>
            {sections.map(s=>(<MenuItem className={{backgroundColor:'#f3f3f3'}} onClick={()=>onChangeSection(s.key,"")} label={s.label}  icon={<FolderOpenIcon />}/>))}
    </Menu>
    </Paper>
)}