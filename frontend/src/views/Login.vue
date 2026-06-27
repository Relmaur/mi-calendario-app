<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import Cookies from 'js-cookie';
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useMainApp } from '../store/mainApp';

const router = useRouter();
const main_app = useMainApp();

/* Which panel is visible */
const mode = ref('login'); // 'login' | 'register'
const serverError = ref('');

/* ── GraphQL mutations ──────────────────────────────────────────── */
const AUTH_FIELDS = gql`
  fragment AuthPayloadFields on AuthPayload {
    accessToken
    refreshToken
    user { id email userName subscription }
  }
`;

const LOGIN_MUTATION = gql`
  ${AUTH_FIELDS}
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) { ...AuthPayloadFields }
  }
`;

const REGISTER_MUTATION = gql`
  ${AUTH_FIELDS}
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) { ...AuthPayloadFields }
  }
`;

const { mutate: loginMutation, loading: loginLoading } = useMutation(LOGIN_MUTATION);
const { mutate: registerMutation, loading: registerLoading } = useMutation(REGISTER_MUTATION);

/* ── Form validation ────────────────────────────────────────────── */
const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
});

const { values, errors, defineInputBinds, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: { email: '', password: '' },
});

const email    = defineInputBinds('email');
const password = defineInputBinds('password');

/* ── Helpers ────────────────────────────────────────────────────── */
const setAuthCookies = (accessToken, refreshToken, user) => {
  const baseOpts = { sameSite: 'lax' };
  Cookies.set('accessToken',  accessToken,  { ...baseOpts, expires: 1 / 96 }); // 15 min
  Cookies.set('refreshToken', refreshToken, { ...baseOpts, expires: 7 });
  Cookies.set('userSession',  encodeURIComponent(JSON.stringify(user)), { ...baseOpts, expires: 7 });
};

const switchMode = (newMode) => {
  mode.value = newMode;
  serverError.value = '';
  resetForm();
};

/* ── Submit ─────────────────────────────────────────────────────── */
const submitForm = handleSubmit(async (vals) => {
  serverError.value = '';
  try {
    const mutate = mode.value === 'login' ? loginMutation : registerMutation;
    const key    = mode.value === 'login' ? 'login'       : 'register';
    const result = await mutate({ email: vals.email, password: vals.password });
    const { accessToken, refreshToken, user } = result.data[key];
    setAuthCookies(accessToken, refreshToken, user);
    main_app.setUser(user);
    router.push('/');
  } catch (err) {
    serverError.value = err.graphQLErrors?.[0]?.message ?? err.message ?? 'Something went wrong';
  }
});

const isLoading = () => loginLoading.value || registerLoading.value;
</script>

<template>
  <div class="auth-page">

    <div class="auth-card">

      <!-- Logo -->
      <div class="auth-logo">
        <svg width="139" height="24" viewBox="0 0 139 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="139" height="24" rx="5" fill="#9DB5A2"/>
          <path d="M5.855 17V6.5H8.765L12.965 13.355H11.435L15.515 6.5H18.425L18.455 17H15.23L15.2 11.36H15.71L12.92 16.055H11.36L8.45 11.36H9.08V17H5.855Z" fill="#E5EFC1"/>
          <path d="M20.1665 17V6.5H23.7065V17H20.1665Z" fill="#E5EFC1"/>
          <path d="M31.285 17.24C30.445 17.24 29.665 17.11 28.945 16.85C28.235 16.58 27.615 16.2 27.085 15.71C26.565 15.22 26.16 14.64 25.87 13.97C25.58 13.3 25.435 12.56 25.435 11.75C25.435 10.94 25.58 10.2 25.87 9.53001C26.16 8.86001 26.565 8.28001 27.085 7.79001C27.615 7.30001 28.235 6.92501 28.945 6.66501C29.665 6.39501 30.445 6.26001 31.285 6.26001C32.315 6.26001 33.225 6.44001 34.015 6.80001C34.815 7.16001 35.475 7.68001 35.995 8.36001L33.76 10.355C33.45 9.96501 33.105 9.66501 32.725 9.45501C32.355 9.23501 31.935 9.12501 31.465 9.12501C31.095 9.12501 30.76 9.18501 30.46 9.30501C30.16 9.42501 29.9 9.60001 29.68 9.83001C29.47 10.06 29.305 10.34 29.185 10.67C29.065 10.99 29.005 11.35 29.005 11.75C29.005 12.15 29.065 12.515 29.185 12.845C29.305 13.165 29.47 13.44 29.68 13.67C29.9 13.9 30.16 14.075 30.46 14.195C30.76 14.315 31.095 14.375 31.465 14.375C31.935 14.375 32.355 14.27 32.725 14.06C33.105 13.84 33.45 13.535 33.76 13.145L35.995 15.14C35.475 15.81 34.815 16.33 34.015 16.7C33.225 17.06 32.315 17.24 31.285 17.24Z" fill="white"/>
          <path d="M35.7306 17L40.3206 6.50001H43.8006L48.3906 17H44.7306L41.3406 8.18001H42.7206L39.3306 17H35.7306ZM38.4606 15.17L39.3606 12.62H44.1906L45.0906 15.17H38.4606Z" fill="white"/>
          <path d="M48.9556 17V6.50001H52.4956V14.255H57.2356V17H48.9556Z" fill="white"/>
          <path d="M61.4534 10.4H66.1334V12.95H61.4534V10.4ZM61.6934 14.33H66.9434V17H58.2134V6.50001H66.7484V9.17001H61.6934V14.33Z" fill="white"/>
          <path d="M68.3062 17V6.50001H71.2162L76.5562 12.89H75.2062V6.50001H78.6562V17H75.7462L70.4062 10.61H71.7562V17H68.3062Z" fill="white"/>
          <path d="M80.3618 17V6.50001H85.5368C86.7068 6.50001 87.7368 6.71501 88.6268 7.14501C89.5168 7.56501 90.2118 8.16501 90.7118 8.94501C91.2118 9.72501 91.4618 10.655 91.4618 11.735C91.4618 12.825 91.2118 13.765 90.7118 14.555C90.2118 15.335 89.5168 15.94 88.6268 16.37C87.7368 16.79 86.7068 17 85.5368 17H80.3618ZM83.9018 14.24H85.3868C85.8868 14.24 86.3218 14.145 86.6918 13.955C87.0718 13.765 87.3668 13.485 87.5768 13.115C87.7868 12.735 87.8918 12.275 87.8918 11.735C87.8918 11.205 87.7868 10.755 87.5768 10.385C87.3668 10.015 87.0718 9.73501 86.6918 9.54501C86.3218 9.35501 85.8868 9.26001 85.3868 9.26001H83.9018V14.24Z" fill="white"/>
          <path d="M91.4679 17L96.0579 6.50001H99.5379L104.128 17H100.468L97.0779 8.18001H98.4579L95.0679 17H91.4679ZM94.1979 15.17L95.0979 12.62H99.9279L100.828 15.17H94.1979Z" fill="white"/>
          <path d="M104.693 17V6.50001H109.748C110.728 6.50001 111.573 6.66001 112.283 6.98001C113.003 7.30001 113.558 7.76001 113.948 8.36001C114.338 8.95001 114.533 9.65001 114.533 10.46C114.533 11.27 114.338 11.97 113.948 12.56C113.558 13.14 113.003 13.585 112.283 13.895C111.573 14.205 110.728 14.36 109.748 14.36H106.658L108.233 12.905V17H104.693ZM110.978 17L108.398 13.175H112.148L114.758 17H110.978ZM108.233 13.295L106.658 11.69H109.523C110.013 11.69 110.373 11.58 110.603 11.36C110.843 11.14 110.963 10.84 110.963 10.46C110.963 10.08 110.843 9.78001 110.603 9.56001C110.373 9.34001 110.013 9.23001 109.523 9.23001H106.658L108.233 7.62501V13.295Z" fill="white"/>
          <path d="M115.87 17V6.50001H119.41V17H115.87Z" fill="#E5EFC1"/>
          <path d="M126.619 17.24C125.769 17.24 124.979 17.105 124.249 16.835C123.529 16.565 122.904 16.185 122.374 15.695C121.844 15.195 121.429 14.61 121.129 13.94C120.839 13.27 120.694 12.54 120.694 11.75C120.694 10.95 120.839 10.22 121.129 9.56001C121.429 8.89001 121.844 8.31001 122.374 7.82001C122.904 7.32001 123.529 6.93501 124.249 6.66501C124.979 6.39501 125.769 6.26001 125.769 6.26001C126.629 6.26001 127.419 6.39501 128.149 6.66501C128.869 6.93501 129.494 7.32001 130.024 7.82001C130.554 8.31001 130.964 8.89001 131.254 9.56001C131.554 10.22 131.704 10.95 131.704 11.75C131.704 12.54 131.554 13.27 131.254 13.94C130.964 14.61 130.554 15.195 130.024 15.695C129.494 16.185 128.869 16.565 128.149 16.835C127.419 17.105 126.629 17.24 126.619 17.24ZM126.619 14.375C126.949 14.375 127.254 14.315 127.534 14.195C127.824 14.075 128.074 13.905 128.284 13.685C128.504 13.455 128.674 13.18 128.794 12.86C128.914 12.53 128.974 12.16 128.974 11.75C128.974 11.34 128.914 10.975 128.794 10.655C128.674 10.325 128.504 10.05 128.284 9.83001C128.074 9.60001 127.824 9.42501 127.534 9.30501C127.254 9.18501 126.949 9.12501 126.619 9.12501C126.289 9.12501 125.979 9.18501 125.689 9.30501C125.409 9.42501 125.159 9.60001 124.939 9.83001C124.729 10.05 124.564 10.325 124.444 10.655C124.324 10.975 124.264 11.34 124.264 11.75C124.264 12.16 124.324 12.53 124.444 12.86C124.564 13.18 124.729 13.455 124.939 13.685C125.159 13.905 125.409 14.075 125.689 14.195C125.979 14.315 126.289 14.375 126.619 14.375Z" fill="#E5EFC1"/>
        </svg>
      </div>

      <!-- Mode toggle -->
      <div class="auth-tabs">
        <button
          :class="['auth-tab', { active: mode === 'login' }]"
          @click="switchMode('login')"
          type="button"
        >
          Sign in
        </button>
        <button
          :class="['auth-tab', { active: mode === 'register' }]"
          @click="switchMode('register')"
          type="button"
        >
          Create account
        </button>
      </div>

      <!-- Form -->
      <form class="auth-form" @submit.prevent="submitForm" novalidate>

        <!-- Email -->
        <div class="auth-field">
          <label for="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            v-bind="email"
            :class="{ invalid: errors.email }"
          />
          <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div class="auth-field">
          <label for="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            v-bind="password"
            :class="{ invalid: errors.password }"
          />
          <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
        </div>

        <!-- Server error -->
        <Transition name="fade">
          <div v-if="serverError" class="server-error">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 shrink-0">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"/>
            </svg>
            <span>{{ serverError }}</span>
          </div>
        </Transition>

        <!-- Submit -->
        <button class="auth-submit" type="submit" :disabled="isLoading()">
          <span v-if="!isLoading()">{{ mode === 'login' ? 'Sign in' : 'Create account' }}</span>
          <span v-else class="loading-dots">
            <span></span><span></span><span></span>
          </span>
        </button>

      </form>

      <!-- Switch hint -->
      <p class="auth-switch">
        <span v-if="mode === 'login'">
          Don't have an account?
          <button type="button" class="auth-link" @click="switchMode('register')">Create one</button>
        </span>
        <span v-else>
          Already have an account?
          <button type="button" class="auth-link" @click="switchMode('login')">Sign in</button>
        </span>
      </p>

    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/abstracts/variables' as *;

.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $general_gray_3;
  padding: 2rem;
}

.auth-card {
  background: white;
  border-radius: 12px;
  box-shadow: $box-shadow;
  padding: 3.2rem 3.2rem 2.4rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.auth-logo {
  display: flex;
  justify-content: center;
}

/* ── Tabs ────────────────────────────────────────────────── */
.auth-tabs {
  display: flex;
  border-bottom: 2px solid $general_gray_2;
  gap: 0;
}

.auth-tab {
  flex: 1;
  background: none;
  border: none;
  padding: 0.8rem 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.3rem;
  font-weight: 500;
  color: $general_gray_1;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;

  &.active {
    color: $general_blue_1;
    font-weight: 700;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: $general_blue_1;
      border-radius: 2px 2px 0 0;
    }
  }

  &:hover:not(.active) {
    color: $general_blue_1;
  }
}

/* ── Form ────────────────────────────────────────────────── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  label {
    font-size: 1.2rem;
    font-weight: 600;
    color: $general_blue_1;
  }

  input {
    width: 100%;
    padding: 1rem 1.2rem;
    border: 1px solid $general_gray_2;
    border-radius: 6px;
    font-family: 'Montserrat', sans-serif;
    font-size: 1.3rem;
    color: #333;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;

    &::placeholder {
      color: $general_gray_1;
    }

    &:focus {
      border-color: $general_blue_1;
      box-shadow: 0 0 0 3px rgba(85, 123, 131, 0.15);
    }

    &.invalid {
      border-color: $general_red_1;

      &:focus {
        box-shadow: 0 0 0 3px rgba(200, 106, 106, 0.15);
      }
    }
  }
}

.field-error {
  font-size: 1.1rem !important;
  color: $general_red_1 !important;
  margin: 0 !important;
}

/* ── Server error banner ─────────────────────────────────── */
.server-error {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.2rem;
  background-color: rgba(200, 106, 106, 0.1);
  border: 1px solid rgba(200, 106, 106, 0.3);
  border-radius: 6px;
  color: $general_red_1;
  font-size: 1.2rem;
}

/* ── Submit button ───────────────────────────────────────── */
.auth-submit {
  width: 100%;
  padding: 1.1rem;
  background-color: $general_green_3;
  color: white;
  border: none;
  border-radius: 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 4.4rem;

  &:hover:not(:disabled) {
    background-color: $general_blue_1;
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

/* ── Loading dots ────────────────────────────────────────── */
.loading-dots {
  display: flex;
  gap: 4px;
  align-items: center;

  span {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: white;
    animation: bounce 1.2s infinite ease-in-out;

    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40%            { transform: scale(1);   opacity: 1; }
}

/* ── Switch hint ─────────────────────────────────────────── */
.auth-switch {
  text-align: center;
  font-size: 1.2rem !important;
  color: $general_gray_1 !important;
  margin: 0 !important;
}

.auth-link {
  background: none;
  border: none;
  padding: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: $general_blue_1;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: $general_blue_2;
  }
}

/* ── Transition ──────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
