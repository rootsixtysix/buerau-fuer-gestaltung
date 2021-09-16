class Event extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      event: []
    };
    this.handleClick = this.handleClick.bind(this);
  }


  handleClick(){
    const url = "http://localhost/ecal/rest/events/read.php?id=1";
    fetch(url)
    .then(res => res.json())
    .then( (fetched)=>{this.setState( {event: fetched})})



  }

  render() {
    return (
      <div id='root'>
      <button onClick={this.handleClick}>press</button>
      <h1>{this.state.event.title}</h1>
      <p>id: {this.state.event.id}</p>
      </div>
    );
  }
}

export default Event
