//DHIS2 component
import i18n from './locales/index.js'

//Material Components
import appTheme from './theme';

//Components
import InitialListSection from './data/listSections.json'
import Content from './components/Content'

import SideMenu from './components/SideMenu';

import {get,post} from './API/Dhis2'

let currentSection;
let sidebarRef;

const stylesLocal = {
  hidde: {
    background: 'gray',
    width: 290,
    height: '100%',
    position: 'absolute',
    opacity: '0.3',
    zIndex: 100
  }
}

class AppFront extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      snackbarMessage: '',
      showSnackbar: false,
      formValidator: undefined,
      sectionToRender: '',
      informationResource: {},
      textSearch: "",
      hiddenSlide: true,
      ListSection:{sections:[]}
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

    this.setResourceSelected(currentSection);
  }

  //search resource on json file using the key
  setResourceSelected(keySelected) {
    let resourceSelected = this.state.ListSection.sections.find(function (resource) {
      return resource.label === keySelected;
    });
    this.setState(
      {
        informationResource: resourceSelected,
        sectionToRender: currentSection,
        textSearch: ""
      });
  }
  changeSearchTextHandler(searchText) {
    this.setState({ textSearch: searchText });
  }

  componentDidMount() {

    // if listsections.json is empty, get it from dhis2
    get('/dataStore/sharingsettingapp/listSections').then(r => {
        if(r.httpStatusCode=== 404){
          console.log("ya no ingresa aquí")
          this.setState({ ListSection: InitialListSection,sectionToRender: InitialListSection.sections[0].label, informationResource: InitialListSection.sections[0] });
          post('/dataStore/sharingsettingapp/listSections', InitialListSection).then(r => {console.log(r)})
        }
        else{
          this.setState({ ListSection: r,sectionToRender: r.sections[0].label, informationResource: r.sections[0] });
        }
      }).catch(error => {
        console.log(error);
      })

  }

  disableSlide(mode) {
    if (mode == 'edit') {
      this.setState({ hiddenSlide: false })
    }
    else {
      this.setState({ hiddenSlide: true })
    }
  }
  render() { 

    return (

      <>      
          {
            this.state.hiddenSlide
              ? ""
              : <div style={stylesLocal.hidde} ></div>

          }
        <div className="app-wrapper">
          <SideMenu sections={
            this.state.ListSection.sections.map((section) => {
              let label = i18n.t(section.label)
              let key = section.label
              return ({ key, label })

            }).filter(section => section.label.includes(this.state.textSearch) == true || this.state.textSearch == "")
          }
            currentSection={this.state.sectionToRender}
            onChangeSection={this.changeSectionHandler}
            onChangeSearchText={this.changeSearchTextHandler}
          />


          <Content
            title={this.state.sectionToRender}
            informationResource={this.state.informationResource}
            disableSlide={this.disableSlide.bind(this)}
          />

        </div>
      </>
    );
  }
}


export default AppFront;

