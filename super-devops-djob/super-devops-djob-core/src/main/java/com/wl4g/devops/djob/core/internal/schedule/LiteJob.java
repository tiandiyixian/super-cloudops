package com.wl4g.devops.djob.core.internal.schedule;

import com.wl4g.devops.djob.core.api.ElasticJob;
import com.wl4g.devops.djob.core.executor.JobExecutorFactory;
import com.wl4g.devops.djob.core.executor.JobFacade;
import lombok.Setter;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

/**
 * Lite调度作业.
 *
 * @author zhangliang
 */
public final class LiteJob implements Job {
    
    @Setter
    private ElasticJob elasticJob;
    
    @Setter
    private JobFacade jobFacade;
    
    @Override
    public void execute(final JobExecutionContext context) throws JobExecutionException {
        JobExecutorFactory.getJobExecutor(elasticJob, jobFacade).execute();
    }
}
