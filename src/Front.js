import React from 'react';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';


//Material Components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';
import appTheme from './theme';

//Components
import ListSection from './data/listSections.json'
import Content from './components/Content'


const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);
let currentSection;
let lastSection;
let sidebarRef;


class AppFront extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      snackbarMessage: '',
      showSnackbar: false,
      formValidator: undefined,
      sectionToRender: '',
      informationResource:{}
    };

    this.changeSectionHandler = this.changeSectionHandler.bind(this);
    this.changeSearchTextHandler = this.changeSearchTextHandler.bind(this);
  }

  // functions
  //hander of seleccion in islide
  changeSectionHandler(key, searchText) {
    currentSection = key;
    if (key !== 'search' && sidebarRef) {
      sidebarRef.clearSearchBox();
    }
    this.setState({ sectionToRender: currentSection });
    this.setResourceSelected(currentSection);
  }

  //search resource on json file using the key
  setResourceSelected(keySelected){
    let resourceSelected=ListSection.sections.find(function(resource){
      return resource.label===keySelected;
    });
    this.setState({ informationResource: resourceSelected });
  }
  changeSearchTextHandler(searchText) {
    if (searchText.toString().trim().length > 0) {
      if (currentSection !== 'search') {
        lastSection = currentSection;
      }
      this.changeSectionHandler('search', searchText);
    } else {
      this.changeSectionHandler(lastSection);
    }
  }
  componentDidMount() {
     this.setState({ sectionToRender: ListSection.sections[0].label , informationResource:ListSection.sections[0]});
  }

  storeRef(ref) {
    sidebarRef = ref;
  }

  // life cycle
  getChildContext() {
    return {
      d2: this.props.d2,
      muiTheme: appTheme
    };
  }

 
  render() {
    const d2 = this.props.d2;
    const iconStyles = {
      marginRight: 24,
    };

    return (

      <MuiThemeProvider muiTheme={appTheme}>
        <div className="app-wrapper">
        <HeaderBar />
        <Sidebar
            sections={ListSection.sections.map(function(section){
                let obj={};
                let label=d2.i18n.getTranslation(section.label);
                let key=section.label
                return({key,label,icon: <FontIcon className="material-icons" >folder_open</FontIcon>})
            })}            
            onChangeSection={this.changeSectionHandler}
            currentSection={this.props.currentSection}
            showSearchField
            searchFieldLabel="Search"
            onChangeSearchText={this.changeSearchTextHandler}
            ref={this.storeRef}
          />
		  
		  <Content
                title={this.state.sectionToRender}
                d2={d2}
                informationResource={this.state.informationResource}
              />

        </div>
      </MuiThemeProvider>
    );
  }
}
AppFront.propTypes = {
  d2: React.PropTypes.object.isRequired,
  currentSection: React.PropTypes.string,
  searchText: React.PropTypes.string
};

AppFront.contextTypes = {
  muiTheme: React.PropTypes.object
};

AppFront.childContextTypes = {
  d2: React.PropTypes.object,
  muiTheme: React.PropTypes.object
};

export default AppFront;

