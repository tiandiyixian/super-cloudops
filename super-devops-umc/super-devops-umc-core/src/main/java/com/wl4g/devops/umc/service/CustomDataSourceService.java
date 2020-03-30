/*
 * Copyright 2017 ~ 2025 the original author or authors. <wanglsir@gmail.com, 983708408@qq.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.wl4g.devops.umc.service;

import com.wl4g.devops.common.bean.umc.CustomDataSource;
import com.wl4g.devops.common.bean.umc.model.DataSourceProvide;
import com.wl4g.devops.page.PageModel;

/**
 * @author vjay
 * @date 2019-08-05 16:01:00
 */
public interface CustomDataSourceService {

	PageModel list(PageModel pm, String name);

	CustomDataSource detal(Integer id);

	void save(CustomDataSource customDatasource);

	void del(Integer id);

	void testConnect(DataSourceProvide dataSourceProvide, String url, String username, String password,Integer id) throws Exception;

}