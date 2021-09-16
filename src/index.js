import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './css/layout.css';
import './css/fontandcolor.css';

class SinglePageApplication extends React.Component {
  constructor(props) {
    super(props);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.state = {
      currentSlug: 'item-1',
      currentPage: {
        title: {rendered: '...'},
        content: {rendered: '...'},
      },
      pageTitle: 'Büro für Gestaltung',
    };
  }

  handleItemClick(currentSlug) {
    const url = 'http://localhost/pwa/bfg/wp-json/wp/v2/pages';
    const php = '?slug=';
    //const slug = 'item-1';
    const slug = currentSlug;
    const path = url + php + slug;
    let page = {
      title: {rendered: ''},
      content: {rendered: ''},
    };

    this.setState({currentPage: page});
    //this.setState({currentSlug: currentSlug});
    fetch(path)
    .then(res => res.json())
    .then( (fetched)=>{this.setState( {currentPage: fetched[0]})})
    .then( this.setState({currentSlug: currentSlug}) )
  }

  componentDidMount(){
    const url = 'http://localhost/pwa/bfg/wp-json/wp/v2/pages';
    const php = '?slug=';
    //const slug = 'item-1';
    const slug = this.state.currentSlug;
    const path = url + php + slug;
    fetch(path)
    .then(res => res.json())
    .then( (fetched)=>{this.setState( {currentPage: fetched[0]})})
    console.log(path);
  }

  render() {
    return (
      <div id='root'>
        <Router>
          <Nav onItemClick={this.handleItemClick}/>
          <div id="right">
            <Header pageTitle={this.state.pageTitle} currentPageTitle={this.state.currentPage.title.rendered}/>
            <Display slug={this.state.currentSlug} page={this.state.currentPage}/>
          </div>
        </Router>
      </div>
    );
  }
}


class Nav extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      items: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.createMarkup = this.createMarkup.bind();
  }

  handleClick(e){
    this.props.onItemClick(e.target.id,);
  }

  componentDidMount(){
    fetch('http://localhost/pwa/bfg/wp-json/wp/v2/pages?order=asc')
    .then(res => res.json())
    .then( (fetched)=>{this.setState( {items: fetched})})
  }

  createMarkup(html) {
    return { __html: html };
  }

  render() {
    return (
      <nav>
        {this.state.items.map(item => (
          <Link to={`/${item.slug}`} key={item.id}>
                <h3 onClick={this.handleClick} id={item.slug}>
                  {item.title.rendered}
                </h3>
          </Link>
        ))}
      </nav>
    );
  }
}


class Display extends React.Component {
  constructor(props){
    super(props);
    this.createMarkup = this.createMarkup.bind();
  }

  createMarkup(html) {
    return { __html: html };
  }

  render(){
    return(
      <main>
        <div dangerouslySetInnerHTML={this.createMarkup( this.props.page.content.rendered )} />
      </main>
    );
  }
}

class Header extends React.Component {
  constructor(props){
    super(props);
    this.createMarkup = this.createMarkup.bind();
  }

  createMarkup(html) {
    return { __html: html };
  }

  render(){
    return(
      <header>
        <h1 id='title'>{this.props.pageTitle}</h1>
        <h2 id='heading'>{this.props.currentPageTitle}</h2>
      </header>
    );
  }
}


ReactDOM.render(
  <React.StrictMode>
    <SinglePageApplication />
  </React.StrictMode>,
  document.getElementsByTagName('body')[0]
);
