import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import Divider from '@mui/material/Divider';
import { Box } from '@mui/system';
export default ({sections}) => {
    return(<div>
    <Paper sx={{ width: 320,height:800,overflow: 'scroll'}}>
    <Box><TextField id="filled-basic" label="Filled" variant="filled" /></Box>
    
<Divider/>
            {sections.map(s=>(<MenuItem>
                <ListItemIcon>
                    <FolderOpenIcon />
                </ListItemIcon>
                {s.label}
            </MenuItem>))}

    </Paper>
</div>)}