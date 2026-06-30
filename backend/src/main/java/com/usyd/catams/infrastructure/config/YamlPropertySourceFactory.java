package com.usyd.catams.infrastructure.config;

import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.core.io.support.PropertySourceFactory;

import java.util.Properties;

public class YamlPropertySourceFactory implements PropertySourceFactory {
    @Override
    public PropertySource<?> createPropertySource(String name, EncodedResource resource) {
        YamlPropertiesFactoryBean bean = new YamlPropertiesFactoryBean();
        bean.setResources(resource.getResource());
        Properties props = bean.getObject();
        return new PropertiesPropertySource(resource.getResource().getFilename(), props);
    }
}
