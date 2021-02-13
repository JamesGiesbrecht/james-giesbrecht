import React, { useContext, useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import FacebookLogin from 'react-facebook-auth'
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'
import { Button, makeStyles, Typography, Container } from '@material-ui/core'
import { Facebook, Apple, GitHub, Twitter } from '@material-ui/icons'
import GoogleIcon from 'components/icons/GoogleIcon'
import WaitFor from 'components/utility/WaitFor'
import { AuthContext } from 'context/Auth'
import { useHistory } from 'react-router-dom'
import useApi from 'hooks/useApi'

const useStyles = makeStyles((theme) => ({
  loginButtons: {
    textAlign: 'center',
    '& button': {
      minWidth: 230,
      margin: theme.spacing(2),
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
  },
  title: {
    marginBottom: 50,
  },
}))

const Login: React.FC = () => {
  const classes = useStyles()
  const { user, setUser } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const api = useApi()
  const history = useHistory()

  useEffect(() => {
    if (user) history.push('/')
  }, [user])

  const responseFacebook = (response: any): void => {
    console.log(response)
  }

  const isGoogleLoginResponse = (response: GoogleLoginResponse | GoogleLoginResponseOffline): response is GoogleLoginResponse => (
    !!response && typeof response === 'object' && !!(response as GoogleLoginResponse).tokenObj
  )

  const responseSuccessGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
    console.log(response)
    if (!isGoogleLoginResponse(response)) return
    const token = response.tokenId
    setIsLoading(true)
    api.post('/google-login', {
      idToken: response.tokenId,
    })
      .then((res: AxiosResponse<any>) => {
        console.log(res)
        setUser({
          profile: res.data.user,
          token,
        })
        console.log(res)
      })
      .catch((err: any) => console.log(err))
      .finally(() => setIsLoading(false))
  }

  const responseErrorGoogle = (response: any): void => {
    console.log('Google sign in unsuccessful', response)
  }

  return (
    <Container className={classes.loginButtons}>
      <Typography className={classes.title} variant="h3">Sign In</Typography>
      <WaitFor isLoading={isLoading}>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_APP_ID as string}
          onSuccess={responseSuccessGoogle}
          onFailure={responseErrorGoogle}
          cookiePolicy="single_host_origin"
          render={(renderProps) => (
            <Button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              variant="outlined"
              startIcon={<GoogleIcon />}
            >
              Sign In with Google
            </Button>
          )}
        />
        <Button
          onClick={() => {}}
          variant="outlined"
          startIcon={<Apple />}
          disabled
        >
          Coming soon...
          {/* Sign In with Apple */}
        </Button>
        <Button
          onClick={() => {}}
          variant="outlined"
          startIcon={<GitHub />}
          disabled
        >
          Coming soon...
          {/* Sign In with GitHub */}
        </Button>
        <Button
          onClick={() => {}}
          variant="outlined"
          startIcon={<Twitter />}
          disabled
        >
          Coming soon...
          {/* Sign In with Twitter */}
        </Button>
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
          callback={responseFacebook}
          component={(renderProps: any) => (
            <Button
              onClick={renderProps.onClick}
              variant="outlined"
              startIcon={<Facebook />}
              disabled
            >
              Coming soon...
              {/* Sign In with Facebook */}
            </Button>
          )}
        />
      </WaitFor>
    </Container>
  )
}

export default Login
