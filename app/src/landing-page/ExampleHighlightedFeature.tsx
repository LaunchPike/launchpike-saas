import HighlightedFeature from './components/HighlightedFeature';
import aiReadyDark from '../client/static/assets/aiready-dark.webp';
import aiReady from '../client/static/assets/aiready.webp';

export default function AIReady() {
  return (
    <HighlightedFeature
      name='Make It AI-Powered'
      description='LaunchPike is AI-ready and AI-accelerated. That means your SaaS MVP comes with built-in support for connecting AI APIs, models, and workflows. From chatbots to analytics and automation, you can integrate smart features in minutes.'
      highlightedComponent={<AIReadyExample />}
      direction='row-reverse'
    />
  );
}

const AIReadyExample = () => {
  return (
    <div className='w-full'>
      <img src={aiReady} alt='LaunchPike ready-made solutions' className='dark:hidden' />
      <img src={aiReadyDark} alt='LaunchPike ready-made solutions' className='hidden dark:block' />
    </div>
  );
};
