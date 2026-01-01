import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title} | TechNova</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
        </Helmet>
    );
};

export default SEO;
