import React , {useState , useEffect} from 'react'
import {
    Grid,
    TextField,
    Box,
    Button ,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    CircularProgress,
} from '@mui/material';
import axios from 'axios'
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { saveAs } from "file-saver";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SearchIcon from '@mui/icons-material/Search';


// dislogue section
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};



const Home = () => {
    const [ myImage , setMyImage ] = useState('');
    const [ myLink , setMyLink ] = useState('');
    const [ myQuery , setMyQuery ] = useState('');

    // handling dialogue actions
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = (img, link) => {
        setOpen(true);
        setMyImage(img);
        setMyLink(link);
    };
    const handleClose = () => {
        setOpen(false);
        setMyImage('');
        setMyLink('');
    };

    // saving file to user pc
    const saveFile = () => {
        saveAs(
            myImage,
            myLink
        );
    };


    const [ allImages , setAllImages ] = useState([]);

    // getting all images
    const getImages = async () => {
        axios.get(`https://api.unsplash.com/photos/?client_id=EEJFtK2BThGGv1VMWfR57Kn0Z7B3PpJePs3xqkI5oG8&page=1&per_page=30&order_by=latest`).then((response) => {
            setAllImages(response.data)
        }).error((err) => console.log("error is : ", err))
    }

    // getting searched images
    const SearchPhotos = async() => {
        axios.get(`https://api.unsplash.com/search/photos/?client_id=EEJFtK2BThGGv1VMWfR57Kn0Z7B3PpJePs3xqkI5oG8&query=${myQuery}&page=1&per_page=30`).then((response) => {
            console.log(response?.data?.results)
            setAllImages(response?.data?.results)
            setMyQuery('')
        }).error((err) => console.log("error is : " , err))
    }

    // getting images from link
    useEffect(() => {
        getImages();
    },[])
    return (
        <>
            {/* seacch section */}
            <Grid container style={{ backgroundColor: '#dcdde1' , height: '60px' , marginBottom: '20px' }} >
                <Grid item xs={2}>
                    <img  src="https://charitycatalogue.com/wp-content/uploads/2017/04/Unsplash-At-RollZign-640x427.png" onClick={getImages} style={{cursor: 'pointer'}} width="100%" height="60px"  alt="Logo" />
                </Grid>
                <Grid item xs={10}>
                    <Box style={{display: 'flex'}}>
                        <TextField id="standard-basic" label="Search free high-resolution images" variant="standard"  style={{borderRadius: '50px' ,backgroundColor: '#FFFFFF' , width: '750px' , marginTop: '5px' , marginBottom: '2px' , marginLeft: '8px'}}  onChange={(e) => setMyQuery(e.target.value)} />
                        <Button  variant = "contained"
                        onClick={SearchPhotos}
                        endIcon = {
                            <SearchIcon />
                        } style={{marginLeft: '10px' , marginTop: '8px' , marginBottom : '8px', fontWeight: 600 , backgroundColor: '#273c75'}} >
                            Search
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        {
            allImages ? (
                <>
                    <Grid container style={{paddingLeft: '20px'}} >
                {
                    allImages?.map((item) => (
                        <Grid item xs={3}>
                            <img src={item?.urls?.regular } key={item?.id} height="300" style={{maxWidth:'100%' , cursor: 'pointer'}} onClick={() => handleClickOpen(item?.urls?.regular , item?.id)} />
                        </Grid>
                    ))
                }
            </Grid>

                    <BootstrapDialog
                        onClose={handleClose}
                        aria-labelledby="customized-dialog-title"
                        open={open}
                        contentStyle={{
                width: '80%',
                maxWidth: '1000px',
            }}
                    >
                        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                            Image Preview
                        </BootstrapDialogTitle>
                        <DialogContent dividers  >
                            <Grid container>
                                <Grid item xs={8}>
                                    <img  src={myImage} width="100%" style={{minWidth: '320px' , maxWidth: '100%'}}  height="300px" />
                                </Grid>
                                <Grid item xs={3.5}  >
                                    <Button  autoFocus onClick = {
                                        saveFile
                                    }
                                    style = {
                                        {
                                            backgroundColor: '#c23616',
                                            color: '#ffffff',
                                            fontWeight: 600,
                                            marginLeft:'15px',
                                            marginTop: '100px'
                                        }
                                    }
                                    startIcon = {
                                        <CloudDownloadIcon/>
                                    } >
                                        Download 
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </BootstrapDialog>
                </>
            ) : (
                <>
                    Please wait ...
                    <CircularProgress/>
                </>
            )
        }
        </>
    )
}

export default Home
