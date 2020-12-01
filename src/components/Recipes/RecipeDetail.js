import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import Ingreadients from './Ingreadients';
import toDate from 'date-fns/toDate'
import * as dateFns from "date-fns";
import { Link } from 'react-router-dom';
import ReactToPrint from 'react-to-print';


import { withStyles } from '@material-ui/core/styles';
import { CardHeader, CardMedia, CardContent, IconButton, Typography, Container, Popover, ListItem, ListItemIcon, ListItemText, Divider, List, Dialog, DialogTitle, DialogContent, Button, FormControl, RadioGroup, FormControlLabel, Radio, DialogActions, Grid, Badge } from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PrintIcon from '@material-ui/icons/Print';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = (theme) => ({
  media: {
    paddingTop: '56.25%',
    size: 80,
  },
  popover: {
    pointerEvents: 'none',
  },
  padding: {
    padding: theme.spacing(2),
  },
  dialog: {
    display: "block",
  },
  icons: {
    display: 'float',
    position: "absolute",
    margin: '10px 0px 0px 85%',
  }

});

let contentToPrint;
let printButton = <IconButton aria-label="print" style={{ display: 'float', position: "absolute", margin: '10px 0px 0px 80%' }}><PrintIcon button /></IconButton>;

const Print = (props) => {
  const componentRef = useState();
  return (
    <div>
      <ReactToPrint
        trigger={() => printButton}
        content={() => componentRef.current}
      />

      <div ref={componentRef} style={{ margin: "40px" }}>
        {contentToPrint}
      </div>
    </div>
  );
};

class RecipeDetail extends Component {
  state = {
    anchorEl: '',
    openListIcons: false,
    tag: 'breakfast',
    checked: false,
    mealType: '',
    openAddToCalendarDialog: false,
    selectedDate: new Date(),
    addItemtoFavorite: [],
  }
  formatDate = (selectedDate) => {
    let dateFormat = 'eee MMM d y xx'
    return dateFns.format(toDate(selectedDate), dateFormat)
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'FETCH_MEAL_PLAN',
      payload: {
        date: this.formatDate(this.state.selectedDate),
      }
    });
    if (this.state.addItemtoFavorite.length === 0) {
      this.state.addItemtoFavorite.length = this.state.addItemtoFavorite.length + localStorage.getItem("notification")
      window.localStorage.setItem('notification', this.state.addItemtoFavorite.length)
    }

  }

  handleOpen = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      openListIcons: true,
    })
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      openListIcons: false,
    })
  };

  addToFavorite = async () => {
    await this.setState({
      openListIcons: false,
      addItemtoFavorite:[ ...this.state.addItemtoFavorite,this.props.item]
    })
    await localStorage.setItem('notification', this.state.addItemtoFavorite.length)
  
    this.props.dispatch({
      type: 'ADD_FAVORITE_RECIPE',
      payload: {
        item: this.props.item,
      }
    });
    this.props.dispatch({
      type: 'NOTIFICATION_BADGE',
      payload: {
        item: this.state.addItemtoFavorite,
      }
    })
    console.log(this.state.addItemtoFavorite)
  }

  addToCalendar = () => {
    this.setState({
      openAddToCalendarDialog: true,
    })

  }

  handleDialogClose = () => {
    this.setState({
      openAddToCalendarDialog: false,
    })
  }

  handleMealTypeChange = (event) => {
    this.setState({
      mealType: event.target.value,
    })
  }

  addThisRecipeToCalendar = () => {
    this.setState({
      openListIcons: false,
      openAddToCalendarDialog: false,
      mealType: ""
    })
    this.props.dispatch({
      type: 'ADD_RECIPE_TO_CALENDAR',
      payload: {
        item: this.props.item,
        mealType: this.state.mealType,
        date: this.formatDate(this.state.selectedDate),
      }
    });
  }

  handleDateChange = (event) => {
    this.setState({
      selectedDate: event,
    })
    this.props.dispatch({
      type: 'FETCH_MEAL_PLAN',
      payload: {
        date: this.formatDate(event),
      }
    });
  };

  handleBackToPlanningAnotherDay = () => {
    this.props.dispatch({
      type: 'FETCH_MEAL_PLAN',
      payload: {
        date: this.formatDate(new Date()),
      }
    });
    this.handleDateChange(new Date());
  }

  render() {

    const { classes, item, reduxState } = this.props;

    const id = this.state.openListIcons ? 'simple-popover' : undefined;

    let showOptionBreakfast = <FormControlLabel value="breakfast" control={<Radio />} label="Breakfast" />;
    let showOptionLunch = <FormControlLabel value="lunch" control={<Radio />} label="Lunch" />;
    let showOptionDinner = <FormControlLabel value="dinner" control={<Radio />} label="Dinner" />;

    reduxState.getMealPlan.map((value) => {
      let mealType = value.meal_type;
      if (mealType === "breakfast") {
        showOptionBreakfast = <div><FormControlLabel value="breakfast" disabled control={<Radio />} label="Breakfast" /></div>
      }
      else if (mealType === "lunch") {
        showOptionLunch = <div><FormControlLabel value="lunch" disabled control={<Radio />} label="Lunch" /></div>
      }
      else if (mealType === "dinner") {
        showOptionDinner = <div><FormControlLabel value="dinner" disabled control={<Radio />} label="Dinner" /></div>
      }
    })

    contentToPrint = <div>
      <CardHeader
        title={item.title}
        subheader={"Cooking: " + item.readyInMinutes + " mins" + "  ,   " +
          "Serving: " + item.servings
        }
      />
      <CardMedia
        className={classes.media}
        image={item.image}
        title={item.title}
      />
      <CardContent>
        <Typography paragraph>Ingreadients: </Typography>
        {item.extendedIngredients.map((i) => {
          return (<div key={i.id}>
            <Ingreadients i={i} />
          </div>
          )
        })}
        <Divider />
        <Typography paragraph>Directions: </Typography>
        <ol>
          {item.analyzedInstructions[0].steps.map(step => (
            <li key={step.id}>{step.step}</li>
          ))}
        </ol>
      </CardContent>
    </div>

    return (
      <Container style={{ position: "relative" }}>
        <IconButton aria-label="settings" className={classes.icons}>
          <MoreVertIcon aria-describedby={id}
            onClick={this.handleOpen}
          />
          <Popover
            id={id}
            open={this.state.openListIcons}
            anchorEl={this.state.anchorEl}
            onClose={this.handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <List component="nav" aria-label="main mailbox folders">
              <ListItem button onClick={this.addToFavorite}>
                <ListItemIcon>
                  <FavoriteBorderIcon />
                </ListItemIcon>
                <ListItemText primary="Add to favorite" />
              </ListItem>
              <ListItem button onClick={this.addToCalendar} >
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText primary="Add to calender" />
              </ListItem>
            </List>
            <Divider />
          </Popover>
        </IconButton>
        <Print />


        <Dialog
          fullWidth="xs"
          maxWidth="xs"
          open={this.state.openAddToCalendarDialog}
          onClose={this.handleDialogClose}
          aria-labelledby="max-width-dialog-title"
        >

          <DialogActions className={classes.dialog}>
            {reduxState.getMealPlan.length !== 3 ?
              (<>
                <DialogTitle id="max-width-dialog-title">Let's plan your meal</DialogTitle>
                <DialogContent >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        // label="Date"
                        value={this.state.selectedDate}
                        onChange={(event) => this.handleDateChange(event)}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />

                    </Grid>
                  </MuiPickersUtilsProvider>
                  <FormControl component="fieldset" >
                    <RadioGroup aria-label="gender" name="gender1" value={this.state.mealType}
                      onChange={this.handleMealTypeChange}>
                      {showOptionBreakfast}{showOptionLunch}{showOptionDinner}

                    </RadioGroup>
                  </FormControl>
                </DialogContent>
                <Button variant="contained" color="primary" onClick={this.addThisRecipeToCalendar}>Add</Button>
              </>)
              :
              <>
                <Typography className={classes.padding}>You planed meal for all day. Check your <Link to="/calendar"> calendar</Link> </Typography>
                <Typography className={classes.padding}>Or planning for another day? <Button onClick={this.handleBackToPlanningAnotherDay} color="primary">Back</Button> </Typography>
              </>
            }
            <Button onClick={this.handleDialogClose} color="primary">
              Close
          </Button>
          </DialogActions>
        </Dialog >
      </Container>

    )
  }
}
const putReduxStateToProps = (reduxState) => ({ reduxState });
export default connect(putReduxStateToProps)(withStyles(useStyles)(RecipeDetail));

