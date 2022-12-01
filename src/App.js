import React from 'react';
import './App.css';
import {
    Box, Card, CardActions, CardContent, CardMedia, Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select, ToggleButton, Typography
} from "@mui/material";
import bakeryData from './bakery-data.json';

function MultiSelect(props) {
    const handleChange = event => {
        props.setOptions({...props.options, [event.target.name]: event.target.checked});
    };

    return (
        <FormControl fullWidth>
            <FormLabel>{props.label}</FormLabel>
            <FormGroup>
                {Object.keys(props.options).map(opt => (<FormControlLabel control={<Checkbox checked={props.options[opt]} onChange={handleChange} name={opt} />} label={opt} />))}
            </FormGroup>
        </FormControl>
    );
}

function ItemCard(props) {
    // const [selected, setSelected] = React.useState(props.selected);
    console.log([props.value, props.selected]);
    const textSelected = {true: 'Remove from Cart', false: 'Add to Cart'};
    const handleChange = event => {
        // setSelected(!selected);
        props.onChange(event, !props.selected);
    }
    return (<Card sx={{ margin: 2 }}>
        <CardMedia component="img" image={props.item.image} />
        <CardContent>
            <Typography variant="h5" component="h2">{props.item.name}</Typography>
            <Typography>{props.item.description}</Typography>
            <Typography>Calories: {props.item.calories}</Typography>
            <Typography>Type: {props.item.type}</Typography>
            <Typography>Dietary Restriction: {props.item.diet}</Typography>
            <Typography>$ {props.item.price}</Typography>
        </CardContent>
        <CardActions>
            <ToggleButton value={props.value} selected={props.selected} onChange={handleChange}>{textSelected[props.selected]}</ToggleButton>
        </CardActions>
    </Card>);
}

function App() {
  const [sort, setSort] = React.useState('name');
  const handleChange = (event) => {
      setSort(event.target.value);
  }

  const [typeOptions, setTypeOptions] = React.useState({bread: false, cake: false, pastry: false});
  const [dietOptions, setDietOptions] = React.useState({nut_free: false, dairy_free: false, gluten_free: false});

  bakeryData.forEach((b, i) => b.index = i);
    let bakeryDataFiltered = [...bakeryData];
    bakeryDataFiltered.sort((a, b) => {
        if (sort === 'name') {
            return a[sort].localeCompare(b[sort]);
        } else {
            return a[sort] - b[sort];
        }
    })
    if (Object.values(typeOptions).some(e => e)) {
        bakeryDataFiltered = bakeryDataFiltered.filter(b => typeOptions[b.type]);
    }
    if (Object.values(dietOptions).some(e => e)) {
        bakeryDataFiltered = bakeryDataFiltered.filter(b => dietOptions[b.diet]);
    }

    const [cart, setCart] = React.useState(new Set());
  const handleCartChange = (event, newSelected) => {
      if (newSelected) {
          cart.add(Number(event.target.value));
      } else {
          cart.delete(Number(event.target.value));
      }
      setCart(new Set(cart));
      console.log(newSelected);
      console.log(cart);
      console.log(cart.has(8));
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={3} display="flex" justifyContent="center">
            <Box sx={{ width: 3/4 }}>
            <FormControl fullWidth margin="normal">
                <InputLabel id="sort-label">Sort by</InputLabel>
                <Select labelId="sort-label" value={sort} label="Sort by" onChange={handleChange}>
                    <MenuItem value={'name'}>Name</MenuItem>
                    <MenuItem value={'price'}>Price</MenuItem>
                    <MenuItem value={'calories'}>Calories</MenuItem>
                </Select>
            </FormControl>
                <MultiSelect options={typeOptions} setOptions={setTypeOptions} label="Type" />
                <MultiSelect options={dietOptions} setOptions={setDietOptions} label="Diet Restriction" />
                <Typography sx={{ alpha: 0.6 }} component="div">Cart</Typography>
                {[...cart.values()].map(i => (<Typography>{bakeryData[i].name}</Typography>))}
                <Typography>Total price: $ {[...cart.values()].reduce((p, i) => p += bakeryData[i].price, 0).toFixed(2)}</Typography>
            </Box>
        </Grid>
        <Grid item xs={9} container>
            {bakeryDataFiltered.map(item => (
                <Grid item xs={12} sm={6} md={4}>
                    <ItemCard value={item.index} item={item} selected={cart.has(item.index)} onChange={handleCartChange} />
                </Grid>
            ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
