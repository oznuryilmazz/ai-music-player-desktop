import { useState } from 'react'

import { Icon } from '@iconify/react'
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useUser } from '../../context/user'
import { signIn } from '../../../api/auth/signin'
import Logo from '../Logo/Index'
import { useNavigate } from 'react-router-dom'

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
        const result = await signIn(values) // result'ı kontrol edin
        console.log('success', result)

        if (result?.success) {
          if (result?.data?.session) {
            localStorage.setItem('supabase.auth.token', JSON.stringify(result?.data?.session))
          }

          // Eğer API yanıtında success döndürülüyorsa
          setUser(result.data?.user) // Doğru kullanıcı bilgisini set edin
          navigate('/')

          console.log('User', result.data?.user)
        } else {
          setShow(true) // Hata durumunda hata mesajını göster
        }
      } catch (error) {
        console.error('Giriş işlemi başarısız:', error)
        setShow(true) // API çağrısı hata aldıysa kullanıcıya göster
      } finally {
        setSubmitting(false) // Butonu tekrar aktif hale getir
      }
    }
  })

  return (
    <Box
      sx={{
        height: 1
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 }
        }}
        width="10%"
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420
          }}
        >
          <Typography variant="h4">AI Music hoşgeldiniz</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Telifli Müzik Yayını İçin
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Demo Yayına Başla
            </Link>
          </Typography>

          {show && (
            <Alert severity="error" style={{ marginBottom: 16 }}>
              Sistemde böyle bir kullanıcı bulunamamaktadır. Lütfen şifrenizi ve mail adresinizi
              tekrar kontrol eder misiniz?.
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3} mb={3}>
              <Stack spacing={1}>
                <Typography variant="body1" style={{ opacity: 0.8 }}>
                  Mail Adresiniz
                </Typography>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="body1" style={{ opacity: 0.8 }}>
                  Şifre
                </Typography>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Icon icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>

              <FormControlLabel
                control={<Checkbox name="rememberMe" color="primary" />}
                label="Beni Hatırla"
              />
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              sx={{ my: 3, display: 'none' }}
            >
              <Link variant="subtitle2" underline="hover">
                Forgot password?
              </Link>
            </Stack>

            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              disabled={formik.isSubmitting}
            >
              Giriş Yap
            </Button>
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
          </Stack>
        </Card>
      </Stack>
    </Box>
  )
}
