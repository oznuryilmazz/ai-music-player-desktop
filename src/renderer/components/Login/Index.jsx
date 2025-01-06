import { useState } from 'react'

import { Icon } from '@iconify/react'
import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import aiAmblem from '../../../../resources/ai-music-logo.png'

import { useUser } from '../../context/user'
import { signIn } from '../../../api/auth/signin'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../../api/users'

export default function LoginView({ searchParams }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [show, setShow] = useState(false)
  const { setUser } = useUser()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Geçerli bir email adresi girin').required('Email gerekli'),
      password: Yup.string().required('Şifre gerekli')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await signIn(values)

        if (result?.success) {
          if (result?.data?.session) {
            localStorage.setItem('supabase.auth.token', JSON.stringify(result?.data?.session))
          }

          const user = await getUser(result.data?.user.id)

          setUser(user?.data)
          navigate('/')

          console.log('User', result.data?.user)
        } else {
          setShow(true)
        }
      } catch (error) {
        console.error('Giriş işlemi başarısız:', error)
        setShow(true)
      } finally {
        setSubmitting(false)
      }
    }
  })

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 1,
        backgroundColor: 'white !important',
        width: '100vw',
        height: '100vh'
      }}
    >
      <Box sx={{ width: '40%' }}>
        <Stack
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ height: 1, width: '100%' }}
        >
          <img src={aiAmblem} width="60%" />

          {show && (
            <Alert severity="error" style={{ marginBottom: 16 }}>
              Sistemde böyle bir kullanıcı bulunamamaktadır. Lütfen şifrenizi ve mail adresinizi
              tekrar kontrol eder misiniz?.
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <Stack
              spacing={3}
              mt={3}
              mb={1}
              sx={{
                paddingBlock: '30px'
              }}
            >
              <TextField
                fullWidth
                id="email"
                name="email"
                placeholder="Mail Adresiniz"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    width: 350,
                    height: '50px',
                    fontSize: '14px',
                    borderRadius: '30px',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f7f8fc'
                  }
                }}
              />
              <TextField
                fullWidth
                id="password"
                name="password"
                placeholder="Şifre"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Icon
                          icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                          color="#00000080"
                        />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '50px',
                    fontSize: '14px',
                    borderRadius: '30px',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f7f8fc'
                  }
                }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                sx={{
                  height: '50px',
                  borderRadius: '30px',
                  fontSize: '16px',
                  textTransform: 'none',
                  backgroundColor: '#397ae0',
                  '&:hover': {
                    backgroundColor: '#1f4cb3'
                  }
                }}
              >
                GİRİŞ YAP
              </Button>
            </Stack>
            {/* 
            <Stack direction="row" alignItems="center" justifyContent="flex-end">
              <Typography variant="caption" underline="hover" color="black">
                Forgot password?
              </Typography>
            </Stack> */}
          </form>

          {searchParams?.message && (
            <Typography
              variant="body2"
              sx={{
                mt: 4,
                p: 2,
                textAlign: 'center',
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main
              }}
            >
              {searchParams.message}
            </Typography>
          )}
          {/* 
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                VEYA
              </Typography>
            </Divider>
            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
              >
                <Icon icon="eva:google-fill" color="#DF3E30" />
              </Button>

              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
              >
                <Icon icon="eva:facebook-fill" color="#1877F2" />
              </Button>

              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
              >
                <Icon icon="eva:twitter-fill" color="#1C9CEA" />
              </Button>
            </Stack> */}
        </Stack>
      </Box>
      <Card
        variant="outlined"
        sx={{
          width: '60%',
          backgroundImage:
            'url(https://zuisuhuepvqscswcocqi.supabase.co/storage/v1/object/public/attachments/login-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}
      >
        <Box
          sx={{
            margin: '0px 32px 0px 0px',
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            color: 'white'
          }}
        >
          <Typography fontSize={40} fontWeight={700} width={750}>
            Yapay Zeka ile İşletme Müziğinin Büyüsüne Hoş Geldiniz.
          </Typography>
          <Typography variant="caption" fontSize={18}>
            İşletme İçi Müzik Yayıncılığında 20 Yıllık Lider
          </Typography>
          <Typography variant="body2" fontWeight={600} fontSize={15}>
            RTP Medya & AI Music
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}
