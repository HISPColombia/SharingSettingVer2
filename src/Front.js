

//Material Components
//import appTheme from './theme';

//Components
//import ListSection from './data/listSections.json'
//import Content from './components/Content'



let currentSection;
let sidebarRef;

const stylesLocal={
  hidde:{
    background:'gray',
    width: 290,
    height: '100%',
    position:'absolute',
    opacity:'0.3',
    zIndex:100
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
      informationResource:{},
      textSearch:"",
      hiddenSlide:true
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
  setResourceSelected(keySelected){
    let resourceSelected=ListSection.sections.find(function(resource){
      return resource.label===keySelected;
    });
    this.setState(
      { 
        informationResource: resourceSelected,
        sectionToRender: currentSection,
        textSearch:"" 
      });
  }
  changeSearchTextHandler(searchText){
    this.setState({textSearch:searchText});
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
      d2: this.props.d2//,
      //muiTheme: appTheme
    };
  }

 disableSlide(mode){
   if(mode=='edit'){
     this.setState({hiddenSlide:false})
   }
   else{
    this.setState({hiddenSlide:true})
   }
 }
  render() {
    const d2 = this.props.d2;
    const iconStyles = {
      marginRight: 24,
    };

    return (

      <>
        <div className="app-wrapper">
           <br/>
        
        
        {
          this.state.hiddenSlide
          ?""
          :<div style={stylesLocal.hidde} ></div>
          
        }
        {/* <Sidebar
            sections={
              ListSection.sections.map((section)=>{
                let obj={};
                let label=d2.i18n.getTranslation(section.label);
                let key=section.label
               return({key,label,icon: <FontIcon className="material-icons" >folder_open</FontIcon>})

            }).filter(section=>section.label.includes(this.state.textSearch)==true || this.state.textSearch=="")
            }
                      
            onChangeSection={this.changeSectionHandler}
            currentSection={this.props.currentSection}
            showSearchField
            searchFieldLabel="Search"
            onChangeSearchText={this.changeSearchTextHandler}
            ref={this.storeRef}         
          /> */}
    
		  {/* <Content
                title={this.state.sectionToRender}
                d2={d2}
                informationResource={this.state.informationResource}
                disableSlide={this.disableSlide.bind(this)}
              /> */}

        </div>
      </>
    );
  }
}
// AppFront.propTypes = {
//   d2: React.PropTypes.object.isRequired,
//   currentSection: React.PropTypes.string,
//   searchText: React.PropTypes.string
// };

// AppFront.contextTypes = {
//   muiTheme: React.PropTypes.object
// };

// AppFront.childContextTypes = {
//   d2: React.PropTypes.object,
//   muiTheme: React.PropTypes.object
// };

export default AppFront;

