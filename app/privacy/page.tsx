import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - PDF Splitter',
  description: 'Privacy policy for PDF Splitter application',
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="mb-6">
        <Link 
          href="/"
          className="text-blue-600 hover:underline"
        >
          &larr; Back to Home
        </Link>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <h2>Analytics</h2>
        <p>
          We use Google Analytics 4 (GA4) to understand how visitors use our site. 
          This helps us improve our service and provide a better user experience.
        </p>
        
        <h3>What information is collected</h3>
        <p>
          When you visit our site, GA4 may collect:
        </p>
        <ul>
          <li>Pages you visit</li>
          <li>How long you spend on each page</li>
          <li>What browser and device you're using</li>
          <li>General location information (country/city level, not precise locations)</li>
          <li>How you interact with our site (clicks, scrolls, etc.)</li>
        </ul>
        
        <h3>How we use this information</h3>
        <p>
          We use this data to:
        </p>
        <ul>
          <li>Understand how users interact with our service</li>
          <li>Find and fix usability issues</li>
          <li>Improve the site's functionality</li>
          <li>Make data-driven decisions about future improvements</li>
        </ul>
        
        <h3>Your choices</h3>
        <p>
          You can opt out of analytics tracking in several ways:
        </p>
        <ul>
          <li>Use the consent banner at the bottom of our site to decline analytics</li>
          <li>Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
          <li>Enable "Do Not Track" in your browser settings</li>
        </ul>
        
        <h2>Local processing</h2>
        <p>
          The PDF Splitter processes files locally in your browser. Your PDF files are never uploaded to our servers.
          The processing happens entirely on your device using client-side JavaScript.
        </p>
        
        <h2>Changes to this policy</h2>
        <p>
          We may update this privacy policy from time to time. The latest version will always be posted on this page.
        </p>
        
        <h2>Contact</h2>
        <p>
          If you have any questions about this privacy policy, please contact us.
        </p>
        
        <p className="text-sm text-gray-500 mt-8">
          Last updated: June 14, 2025
        </p>
      </div>
    </div>
  );
}
